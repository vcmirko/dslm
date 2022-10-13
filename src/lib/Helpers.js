const Ajv = require('ajv');
const AJVErrorParser = require('ajv-error-parser');
const fs = require('fs')
var Helpers=function(){

};

// geluiden
Helpers.playCorrect=function(){
  var audio = new Audio('assets/sound/correct.mp3'); // path to file
  audio.play();
}
Helpers.playWrong=function(){
  var audio = new Audio('assets/sound/wrong.mp3'); // path to file
  audio.play();
}
Helpers.playStopClock=function(){
  var audio = new Audio('assets/sound/countdown-pause.mp3'); // path to file
  audio.play();
}
Helpers.playCountdown=function(){
  var audio = new Audio('assets/sound/countdown.mp3'); // path to file
  audio.play();
  return audio;
}
Helpers.playIntro=function(){
  var audio = new Audio('assets/sound/intro.mp3'); // path to file
  audio.play();
  return audio;
}
Helpers.playEnd=function(){
  var audio = new Audio('assets/sound/countdown-complete.mp3'); // path to file
  audio.play();
}

// getters
Helpers.getPlayerWithLowestScore = function(lijst){
    var tmparr = [...lijst]
    if(lijst){
      var laagste=tmparr.sort(function (a, b) { return a.score < b.score ? -1 :a.score > b.score ? 1 : 0; });
      if(laagste[0])
        return laagste[0].index
      else {
        return 0
      }
    }else{
      return 0
    }
}
Helpers.getPlayerWithHighestScore = function(lijst){
    var tmparr = [...lijst]
    if(lijst){
      var hoogste=tmparr.sort(function (a, b) { return a.score > b.score ? -1 :a.score < b.score ? 1 : 0; });
      return hoogste[0].index
    }else{
      return 0
    }
}
Helpers.getNextPlayer = function(lijst,huidige){
    if(lijst){
      var volgende = lijst.filter(item => item.index>huidige)
      if(volgende.length>0){
        return volgende[0].index
      }else{
        return lijst[0].index
      }
    }else{
      return 0
    }
}
Helpers.getAnsweredPlayer = function(play,answer){
    var a = play.question.found.find(f => f.answer==answer)
    if(a){
      return play.players[a.player].name
    }else{
      return ""
    }
}
Helpers.getAnsweredPoints = function(play,answer){
    var a = play.question.found.find(f => f.answer==answer)
    if(a){
      return a.points
    }else{
      return false
    }
}
Helpers.getAnswer = function(quiz,play){
    return this.getQuestion(quiz,play).answers[play.question.answer]
}
Helpers.getRemainingAnswers = function(quiz,play){
    var foundSoFar=play.question.found.map(f=>{return f.answer});
    return this.getQuestion(quiz,play).answers.filter((_, index) => !foundSoFar.includes(index));
}
Helpers.getAnswers = function(quiz,play){
    return play.question.found.map(f=>{return f.answer});
}
Helpers.getFinalPlayers = function(quiz,play){
  if(play.round.finalplayers.length==0){ // hebben nog geen finalespelers ?
    var players = [...play.players]  // we nemen alle spelers
    var watchdog=0
    var nonfinalist=undefined
    do{
      if(play.final=="winners"){
        nonfinalist = this.getPlayerWithLowestScore(players) // haal de laagste op
      }else{
        nonfinalist = this.getPlayerWithHighestScore(players) // haal de hoogste op
      }
      watchdog++
      players = players.filter((player) => player.index!=nonfinalist)  // en verwijder
    }while(players.length>2 && watchdog<5)                             // tot we er 2 over hebben
    return players
  }else{
    return play.round.finalplayers
  }
}
Helpers.getRemainingPlayers = function(quiz,play) {  // welke speler mogen er nog antwoorden
  var players = []
  if(this.getRound(quiz,play).type=="finale" && play.round.finalplayers.length>0){  // indien finale, starten we met de finale spelers
    players = play.round.finalplayers
  }else{
    players = play.players                                           // anders starten we met alle spelers
  }
  var remaining = players.filter((player, index) => !play.question.attempted.includes(player.index)) // we verwijderen die die al poging gedaan hebben
  return remaining.sort((a,b) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0));          // we sorteren ze weer in correcte volgorde
}
Helpers.getRemainingPlayersToGo = function(quiz,play) {  // welke speler mogen er nog antwoorden
  var players = []
  players = play.players
  var remaining = players.filter((player, index) => !play.round.played.includes(player.index)) // we verwijderen die die al poging gedaan hebben
  return remaining.sort((a,b) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0));          // we sorteren ze weer in correcte volgorde
}
Helpers.getRemainingQuestions = function(quiz,play) {
    return this.getRound(quiz,play).questions.filter((_, index) => !play.round.answered.includes(index));
}
Helpers.getQuestion = function(quiz,play){
    return this.getRound(quiz,play).questions[play.question.current]
}
Helpers.getRound = function(quiz,play){
  return quiz.rounds[play.round.current]
}
Helpers.getPlayer = function(quiz,play){
  return play.players[play.player.current]
}

// savers
Helpers.saveQuiz = function(quiz){
  try{
    localStorage.dslmquiz = JSON.stringify(quiz)
    return true
  }catch(e){
    return false
  }

}
Helpers.validateQuiz = function(quiz){
  var schema = require("../../public/assets/schema/dslm.json")
  var ajv = new Ajv()
  var ajvMessages = []
  var errormessages = ""
  var nrSpelers
  var valid = ajv.validate(schema, quiz)
  if (!valid){
    ajvMessages = AJVErrorParser.parseErrors(ajv.errors)
  } else {
    quiz.rounds.forEach((r) => {
      if(r.type=="369" && r.questions.length!=12){
        ajvMessages.push("369 ronde heeft te weinig vragen (" + r.questions.length + "<12)")
      }
      if(r.type=="opendeur"){
        nrSpelers=r.questions.length
      }
      if(r.type=="finale" && r.questions.length<=10){
        ajvMessages.push("finale ronde zou minstens 10 vragen moeten hebben")
      }
      if(!["369","opendeur","finale"].includes(r.type)){
        if(nrSpelers!=r.questions.length){
          ajvMessages.push(r.type + " ronde heeft niet het juiste aantal vragen (opendeur heeft "+nrSpelers+") en deze ronde heeft er "+ r.questions.length)
        }
      }
    })
  }
  errormessages=ajvMessages.join("CRLF")
  errormessages=errormessages.replaceAll(/rounds\[0\][.]*/igm, "ronde '369', ")
  errormessages=errormessages.replaceAll(/rounds\[1\][.]*/igm, "ronde 'Opendeur', ")
  errormessages=errormessages.replaceAll(/rounds\[2\][.]*/igm, "ronde 'Puzzel', ")
  errormessages=errormessages.replaceAll(/rounds\[3\][.]*/igm, "ronde 'Gallerij', ")
  errormessages=errormessages.replaceAll(/rounds\[4\][.]*/igm, "ronde 'Collectief Geheugen', ")
  errormessages=errormessages.replaceAll(/rounds\[5\][.]*/igm, "ronde 'Finale', ")
  errormessages=errormessages.replaceAll(/questions\[([0-9]*)\][.]*/igm, ("vraag 0$1~01234567890 "))
  errormessages=errormessages.replaceAll(/questions\[([0-9]*)\][.]*/igm, ("vraag 0$1~01234567890 "))
  errormessages=errormessages.replaceAll(/answers\[([0-9]*)\][.]*/igm, ("antwoord 0$1~01234567890 "))
  errormessages=errormessages.replaceAll(/answers\[([0-9]*)\][.]*/igm, ("antwoord 0$1~01234567890 "))
  errormessages=errormessages.replaceAll("should not have additional properties","Onverwacht attribuut")
  errormessages=errormessages.replaceAll("should have required property","ontbreekt het attribuut")
  errormessages=errormessages.replaceAll(/\media should match pattern.*/igm,"media is geen foto, film of audio") // eslint-disable-line
  errormessages=errormessages.replaceAll(/\review should match pattern.*/igm,"review is geen foto, film of audio") // eslint-disable-line
  errormessages=errormessages.replaceAll(/\preview should match pattern.*/igm,"preview is geen foto, film of audio") // eslint-disable-line
  errormessages=errormessages.replaceAll(/\b0(?!9*~)|([0-9])(?=9*~[0-9]*?\1([0-9]))|~[0-9]*/g,"$2")
  return errormessages
}
Helpers.initQuiz = function(quiz,play){
  var nrSpelers = play.players.length
  var changed=false
  quiz.rounds.forEach((r) => {
    if(!["369","finale"].includes(r.type)){
      while(r.questions.length > nrSpelers){
        r.questions.pop()
        changed=true
      }
    }
  })
  return changed
},
Helpers.savePlay = function(play){
  try{
      localStorage.dslmplay = JSON.stringify(play)
      return true
  }catch(e){
    return false
  }
}
Helpers.saveToken = function(token){
  try{
      localStorage.dslmtoken = token
      return true
  }catch(e){
    return false
  }
}
// loaders
Helpers.loadToken = function(){
  try{
      return localStorage.dslmtoken
  }catch(e){
    return undefined
  }
}
Helpers.mediaExists = function(url){

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = function() {
      const status = request.status;
      if (request.status == 200) //if(statusText == OK)
      {
        return true
      } else {
        return false
      }
    }

}
Helpers.loadQuiz = function(){
  var quiz
  try{

    quiz = JSON.parse(localStorage.dslmquiz)
    return quiz
  }catch(err){
    // console.log(err)
    return undefined
  }
}
Helpers.loadPlay = function(){
  var play
  try{
    play = JSON.parse(localStorage.dslmplay)
    return play
  }catch(err){
    console.log(err)
    return undefined
  }
}
// andere helpers
Helpers.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
Helpers.fileNameSafeYaml = function(s,type){
  return type + "_" + s.replace(/[^a-z0-9]/gi, '_').toLowerCase()+".yaml";
}
Helpers.onlyUnique = function(value, index, self) {
  return self.indexOf(value) === index;
}
export default Helpers

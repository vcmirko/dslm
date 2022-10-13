<template>
  <div>
    <fullscreen v-model="fullscreen" v-if="isLoaded && !showChangeScore && !showChangeName">

      <div :class="{'has-background-dslm':view && fullscreen}">
        <section class="dslm section">
          <div v-if="round && !play.complete" class="rounds">
              <Summary v-if="!play.round.started" :quiz="quiz" :play="play" :view="view" @startRound="startRound" @startScore="giveStartScore()"></Summary>
              <R369 v-if="isRound369() && play.round.started" :quiz="quiz" :play="play" :view="view" @checkQuestion="check369Question" @showMedia="showMedia"></R369>
              <Opendeur v-if="isRoundOpenDeur() && play.round.started" :quiz="quiz" :play="play" :view="view" @showMedia="showMedia" @hideAnswers="hideAnswers" @stopAnswers="stopAnswers" @startAnswers="startAnswers" @showAnswers="showAnswers" @checkAnswer="checkAnswer" @destroyClock="destroyClock"></Opendeur>
              <Puzzel v-if="isRoundPuzzel() && play.round.started" :quiz="quiz" :play="play" :view="view" @hideAnswers="hideAnswers" @stopAnswers="stopAnswers" @startAnswers="startAnswers" @showAnswers="showAnswers" @checkAnswer="checkAnswer" @destroyClock="destroyClock"></Puzzel>
              <Gallerij v-if="isRoundGallerij() && play.round.started" :quiz="quiz" :play="play" :view="view" @hideAnswers="hideAnswers" @stopAnswers="stopAnswers" @startAnswers="startAnswers" @showAnswers="showAnswers" @checkAnswer="checkAnswer" @review="review" @previousAnswer="previousAnswer" @nextAnswer="nextAnswer" @destroyClock="destroyClock"></Gallerij>
              <CollectiefGeheugen v-if="isRoundCollectiefGeheugen() && play.round.started" :quiz="quiz" :view="view" :play="play" @showMedia="showMedia" @hideAnswers="hideAnswers" @stopAnswers="stopAnswers" @startAnswers="startAnswers" @showAnswers="showAnswers" @checkAnswer="checkAnswer" @destroyClock="destroyClock"></CollectiefGeheugen>
              <Finale v-if="isRoundFinale() && play.round.started" :quiz="quiz" :view="view" :play="play" @hideAnswers="hideAnswers" @stopAnswers="stopAnswers" @startAnswers="startAnswers" @showAnswers="showAnswers" @checkAnswer="checkAnswer" @destroyClock="destroyClock"></Finale>
          </div>
          <div v-if="play.complete">
            <div class="has-text-centered container">
              <div class="mb-3 roundTitle is-family-secondary">'t is gebeurd!</div>
              <div class="is-size-2">
                "{{ play.winner }}" wint deze finale!<br>
                <button v-if="!view" class="button is-warning" @click="toggleFinalAnswers()">{{ (play.showFinalAnswers?"Verberg":"Toon")}} antwoorden</button>
              </div>

              <div class="columns is-centered">
                <div class="column">
                  <div class="box darkbg">
                      <div class="is-inline-block box has-background-white has-text-dark is-size-3 p-5 is-family-monospace" style="width:700px">
                        {{ play.when }} hebben wij een openbaar onderzoek gehouden onder leiding van de immer nieuwsgierige vorser {{ play.quizmaster }}.
                        Een onderzoek naar de slimste mens {{ play.bestof }}, {{ play.circumstances}}.<br>
                        Het resultaat is dat vanaf heden, {{ new Date().toLocaleDateString('nl-BE',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }},
                        de genaamde, {{ play.winner }}  , niet langer als dusdanig hoeft aangesproken te worden. Juister en eerbiediger is om vanaf nu te zeggen:<br>
                        <div mx-6>De Slimste Mens {{ play.bestof }}<br>
                        Quod erat demonstrandum<br>
                        {{ play.winnerGets }}.</div>
                      </div>
                  </div>
                </div>
                <div class="column is-one-third" v-if="play.showFinalAnswers" >
                  <div class="box darkbg">
                      <Answers :quiz="quiz" :play="play" :view="view" />
                  </div>
                </div>

              </div>

            </div>
          </div>
          <div class="logo has-text-centered"><span class="small">de</span> <span>SLIMSTE</span><br><span>MENS </span><span class="top small">{{ play.bestof}}</span></div>
        </section>
        <nav class="navbar is-fixed-bottom is-primary is-mobile">
          <div class="navbar-brand">
            <a class="navbar-item" @click="toggleFullscreen()">
              <span class="icon"><font-awesome-icon icon="expand-arrows-alt" /></span>
            </a>
            <router-link v-if="!view" class="navbar-item" to="/">
              <span class="icon"><font-awesome-icon icon="home" /></span><span>Home</span>
            </router-link>
            <a class="navbar-item" v-if="!view" :class="{'is-disabled':!(play.round.current>0 && !play.complete)}" @click="previousRound(true)">
              <span class="icon"><font-awesome-icon icon="arrow-left" /></span>
            </a>
            <a class="navbar-item" v-if="!view" :class="{'is-disabled':!(play.round.current<(quiz.rounds.length-1) && !play.complete)}" @click="nextRound(true)">
              <span class="icon"><font-awesome-icon icon="arrow-right" /></span>
            </a>
            <a class="navbar-item" v-if="!view" @click="showChangeScore=true">
              <span class="icon"><font-awesome-icon icon="undo-alt" /></span><span>Scores</span>
            </a>
            <a class="navbar-item" v-if="!view" @click="showChangeName=true">
              <span class="icon"><font-awesome-icon icon="user" /></span><span>Gebruikers</span>
            </a>
            <router-link v-if="!view" class="navbar-item" to="/view" target="_blank">
              <span class="icon"><font-awesome-icon icon="eye" /></span><span>Deelnemers scherm</span>
            </router-link>
            <router-link v-if="!view" class="navbar-item" to="/designer">
              <span class="icon"><font-awesome-icon icon="pencil-alt" /></span><span>Designer</span>
            </router-link>
          </div>
        </nav>
      </div>
    </fullscreen>
    <div v-if="!isLoaded">
      <div class="box darkbg has-text-centered">
        <div class="notification is-warning is-inline-block" width="400px">
          Geen quiz gevonden op de locale storage.<br>
          Keer terug naar home en start een nieuwe quiz.<br>
          <router-link v-if="!view" class="button is-success mt-5" to="/">
            <span class="icon"><font-awesome-icon icon="home" /></span><span>Home</span>
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="isLoaded && showChangeScore">
      <div class="box darkbg has-text-centered">
        <div class="notification is-warning is-inline-block" width="400px">
          <h2 class="is-family-secondary is-size-3 mb-2">Scores</h2>
          <div class="field" v-for="player,index in play.players" :key="'player'+index">
            <label class="label">Speler {{(index+1)}}</label>
            <p class="control">
              <input class="input" type="number" @change="savePlay()" v-model.number="play.players[index].score">
            </p>
          </div>
          <button class="button is-success mt-5" @click="showChangeScore=false">
            <span class="icon"><font-awesome-icon icon="times" /></span><span>Close</span>
          </button>
        </div>
      </div>
    </div>
    <div v-if="isLoaded && showChangeName">
      <div class="box darkbg has-text-centered">
        <div class="notification is-warning is-inline-block" width="400px">
          <h2 class="is-family-secondary is-size-3 mb-2">Namen</h2>
          <div class="field" v-for="player,index in play.players" :key="'player'+index">
            <label class="label">Speler {{(index+1)}}</label>
            <p class="control">
              <input class="input" type="text" @change="savePlay()" v-model.number="play.players[index].name">
            </p>
          </div>
          <button class="button is-success mt-5" @click="showChangeName=false">
            <span class="icon"><font-awesome-icon icon="times" /></span><span>Close</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import axios from 'axios'
  import Score from './../components/Score.vue'
  import R369 from './../components/R369.vue'
  import Opendeur from './../components/Opendeur.vue'
  import Puzzel from './../components/Puzzel.vue'
  import Gallerij from './../components/Gallerij.vue'
  import Finale from './../components/Finale.vue'
  import CollectiefGeheugen from './../components/CollectiefGeheugen.vue'
  import Summary from './../components/Summary.vue'
  import Answers from './../components/Answers.vue'
  import Helpers from './../lib/Helpers'
  import VueFullscreen from 'vue-fullscreen'
  Vue.use(VueFullscreen)
  export default{
    components:{R369,Opendeur,Puzzel,Gallerij,CollectiefGeheugen,Finale,Answers,Summary},
    name:"QuizDslm",
    props:{
      view:{type:Boolean,default:false}
    },
    data(){
      return  {
        quiz:undefined,
        play:undefined,
        clock:undefined,
        fullscreen: false,
        clockAudio:undefined,
        showChangeScore:false,
        showChangeName:false
      }
    },
    computed: {
      isLoaded(){ return this.play!=undefined && this.quiz!=undefined },
      round(){ return Helpers.getRound(this.quiz,this.play)},
      player(){ return Helpers.getPlayer(this.quiz,this.play)},
      remainingPlayers() { return Helpers.getRemainingPlayers(this.quiz,this.play)},
      remainingPlayersToGo() { return Helpers.getRemainingPlayersToGo(this.quiz,this.play)},
      remainingQuestions() { return Helpers.getRemainingQuestions(this.quiz,this.play)},
      question(){ return Helpers.getQuestion(this.quiz,this.play) },
      stillPlayers(){
        return (this.remainingPlayers.length>0)
      },              // zijn er nog spelers ?
      stillAnswers(){
        return (Helpers.getRemainingAnswers(this.quiz,this.play).length>0)
      },              // zijn er nog antwoorden ?
      stillQuestions(){
        return (this.remainingQuestions.length>0)
      }            // zijn er nog vragen ?
    },
    watch: {
    },
    beforeMount() {
      this.loadDslm()
      this.loadPlay()
      if(this.play){
        this.initPlay()
      }
      if(this.quiz){
        this.initQuiz()
      }
    },
    mounted(){
      if(this.view){
        setInterval(this.loadPlay,10)
      }
      // if clock was running, start ticker
      if(!this.view && this.play.question.clock){
        this.startClock()
      }
    },
    methods: {

        toggleFullscreen () { this.fullscreen = !this.fullscreen },
        toggleFinalAnswers() {
          this.play.showFinalAnswers=!this.play.showFinalAnswers
          this.savePlay()
        },
        giveStartScore(){
          this.play.players.forEach((item, i) => {
            item.score=60
          });
          this.savePlay()
        },
        loadDslm(){
            this.quiz=Helpers.loadQuiz()
        },
        loadPlay(){
            this.play=Helpers.loadPlay()
        },
        initQuiz(){
           var changed=Helpers.initQuiz(this.quiz,this.play)
           if(changed){
             this.$toast.info("Vragen zijn gereduceerd tot aantal spelers")
           }
        },
        initPlay(){                   // initializeer spel
          this.play.players.map((p,index) => {this.play.players[index].index = index}) // indexeer spelers
          if(this.play.round<0){
              this.nextRound()            // start de ronde !
          }
        },
        check369Question(ok,points,id=undefined){ // check 369 vraag

          // speel geluid
          if(ok){
            Helpers.playCorrect()
          }else{
            Helpers.playWrong()
          }

          if(ok){
            if(id!=undefined){
              this.play.player.current=id // indien doe-vraag, fixed op speler zetten
            }
            this.play.player.lastsuccess=this.play.player.current  // markeer speler met laatste success
            this.changeScore(points)
            this.play.round.answered.push(this.play.question.current) // markeer vraag geantwoord
            this.nextQuestion() // volgende
          }else{
            if(!this.nextPlayer(false)){ // geef de anderen de kans
              this.play.round.answered.push(this.play.question.current) // geen spelers meer, vraag is beantwoord
              this.nextQuestion() // volgende
            }
          }
          this.savePlay()
        },
        nextQuestion(id=undefined){   // ga naar volgende vraag
          // console.log("volgende vraag")
          if(id!=undefined){ // heel specifiek ? (opendeur)
            this.play.question.current=id
            this.resetQuestion()
          }else{
            if(this.play.question.current<this.round.questions.length-1){ // niet laatste vraag ?
              this.play.question.current++  // volgende
              this.resetQuestion()
            }else{
              this.resetQuestion()
              this.nextRound()  // anders volgende ronde !
            }
            if(this.isRoundFinale()){
              // finale, elke vraag, laagste mag beginnen
              this.play.player.current=Helpers.getPlayerWithLowestScore(this.play.round.finalplayers)
              // console.log("speler met laagste score finale - " + this.play.player.current)
            }else if(!this.isRound369()){
              this.play.player.current=Helpers.getPlayerWithLowestScore(this.remainingPlayersToGo)
              // console.log("speler met laagste score van togo - " + this.play.player.current)
              // console.log("speler " + this.play.player.current + " mocht als eerste")
              this.play.round.played.push(this.play.player.current)
            }
          }
          this.savePlay()
        },
        initRound(manual=false){                  // initializeer ronde
            // indexeer vragen
            this.quiz.rounds[this.play.round.current].questions.map((p,index) => {this.quiz.rounds[this.play.round.current].questions[index].index = index})
            this.resetRound()
            if(this.isRoundFinale()){  // finale ? speel dan met hen
              this.play.round.finalplayers=Helpers.getFinalPlayers(this.quiz,this.play)
              this.play.player.current=Helpers.getPlayerWithLowestScore(this.play.round.finalplayers)
              // console.log("speler met laagste score init ronde finale - " + this.play.player.current)
            }else if(!this.isRound369()){ // geen finale en geen 369, zet de speler op de laagste
              this.play.player.current=Helpers.getPlayerWithLowestScore(this.remainingPlayersToGo)
              // console.log("speler met laagste score init ronde niet finale - " + this.play.player.current)
            }
            if(manual){
              // wanneer we manueel bladeren, zet de eerste vraag op 1, tenzij opendeur, die is vrij te kiezen
              if(!this.isRoundOpenDeur())
                this.nextQuestion()
            }
            this.savePlay()
        },
        previousRound(manual=false){              // vorige ronde, niet gebruikelijk, maar het kan
          if(this.play.round.current>0){
            this.play.round.current--
            this.initRound(manual)
          }
          this.savePlay()
        },
        nextRound(manual=false){                  // ga naar volgende ronde
          if(this.play.round.current<this.quiz.rounds.length-1){
            this.play.round.current++
            this.initRound(manual)  // initializeer de ronde
          }else{
            // dit is een speciaal geval
            // we gaan dus manueel naar de volgende ronde, maar er zijn er geen meer
            // dit will zeggen dat de clock niet op 0 kwam, maar de vragen wel op zijn
            // We duiden de persoon met de hoogste score als winnaar
            if(!manual){ // don't allow nav to go this point
              this.itsDone(Helpers.getPlayerWithHighestScore(Helpers.getFinalPlayers(this.quiz,this.play)))
            }

          }
          this.savePlay()
        },
        nextAnswer(){                 // voor gallerij, volgende foto
          if(this.play.question.answer<(this.question.answers.length-1)){
            this.play.question.answer++
          }else{
            this.stopAnswers() // de rest mag aanvullen
          }
          this.savePlay()
        },
        previousAnswer(){             // voor gallerij, vorige foto tijdens review
          if(this.play.question.answer>0){
            this.play.question.answer--
          }
          this.savePlay()
        },
        resetRound(){                 // reset ronde info
          this.play.round.complete=false   // gedaan ?
          this.play.round.played=[]     // welke speler mocht al eens starten/kiezen
          this.play.round.started=false    // gestart ? => summary of niet ?
          this.play.round.answered=[]      // welke vragen zijn reeds gedaan
          this.play.round.finalplayers=[]  // finale spel, wie zijn de finalespelers
          this.play.question.current=-1    // reset current vraag
          this.resetQuestion()
        },
        startRound(){                 // start ronde
          this.play.round.started=true
          this.savePlay()
        },
        resetQuestion(){              // reset vraag info
          Vue.set(this.play.question,'attempted',[])
          this.play.question.found=[]          // welke antwoorden zijn er gevonden
          this.play.question.finished=false    // vraag gedaan ?
          this.play.question.showMedia=false   // trigger om media te tonen voor een vraag -> 3-6-9,opendeur,collectiefgeheugen
          this.play.question.showAnswers=false // aan het antwoorden, of tussenin ?
          this.play.question.answer=0          // welk antwoord ?  gallerij ronde => foto's lopen op
          this.play.question.clock=false       // loopt clock
          this.play.question.review=false      // antwoord review ? gallerij ronde
          if(this.isRoundPuzzel()){            // puzzel ronde ?  Shuffle de woorden
            this.play.question.words=["w11","w12","w13","w14","w21","w22","w23","w24","w31","w32","w33","w34"]      // puzzle order
            Helpers.shuffleArray(this.play.question.words)
          }
          this.savePlay()
        },
        changeScore(points){          // wijzig de score
          if(points>0){
            this.play.players[this.play.player.current].score+=points // tel punten bij
          }
          if(points<0){ // negatieve puntnen enkel mogelijk in finale !
            var other = this.getOtherFinalPlayer()  // zoek andere finale speler
            this.play.players[other].score+=points  // haal punten af van andere speler
            if(this.play.players[other].score<=0){  // is de andere op nul ?
              this.play.players[other].score=0
              this.itsDone(this.play.player.current) // 't is gebeurd
            }
          }
          this.savePlay()
        },
        nextPlayer(byScore=false){    // ga naar volgende speler
          if(this.isRound369())
            this.play.question.attempted.push(this.play.player.current) // markeer huidige speler als gepasseerd bij 369
          if(!this.stillPlayers){  // geen speler meer ?
            this.play.question.finished=true // vraag is klaar
            if(this.isRound369()){           // 369 mag de laaste die het goed had, opnieuw
              this.play.player.current=this.play.player.lastsuccess
              // console.log("speler die vraag juist had - " + this.play.player.current)
            }
            this.savePlay()
            return false // geen speler gevonden
          }else{
              if(byScore){ // volgende speler volgende laatste score ?
                this.play.player.current=Helpers.getPlayerWithLowestScore(this.remainingPlayers) // zoek laagste
                // console.log("speler met laagste score next player - " + this.play.player.current)
              }else{
                // enkel bij 369
                this.play.player.current=Helpers.getNextPlayer(this.remainingPlayers,this.play.player.current) // haal volgende in lijn
                // console.log("speler volgende in lijn - " + this.play.player.current)
              }
              this.savePlay()
              return true // speler gevonden
          }
        },
        checkAnswer(id,points){       // check antwoord

          if(points==0){  // punten ?
            Helpers.playWrong() // fout geluid
          }else {
            Helpers.playCorrect() // goed geluid
          }
          if(points!=0){ // waregen er punten ?
            this.play.question.found.push({answer:id,player:this.play.player.current,points:points}) // markeer punten en speler
            this.changeScore(points) // ken punten toe
          }
          if(!this.stillAnswers){ // gedaan ?
            this.play.question.finished=true  // markeer vraag als compleet
            this.stopAnswers()                // stop met antwoorden
          }else{
            if(this.isRoundGallerij() && this.isFirstPlayer()){
              this.nextAnswer() // auto volgende foto in gallerij ronde als het eerste speler is
            }
          }
          this.savePlay()
        },
        showMedia(id=undefined){      // toon/verberg media aan deelnemersscherm
          if(id!=undefined){     // indien specifieke vraag (opendeur), zeg vraag als current
            this.play.question.current=id
            // console.log("speler " + this.play.player.current + " heeft mogen kiezen")
            this.play.round.played.push(this.play.player.current)
          }
          this.play.question.showMedia=!this.play.question.showMedia
          this.savePlay()
        },
        showAnswers(id){              // toon antwoorden

           this.play.question.showAnswers=true
           this.round.questions[id].answers.map((p,index) => {this.round.questions[id].answers[index].index = index}) // indexeer antwoorden
           this.startClock()    // start de klok
        },
        hideAnswers(){                // verberg antwoorden, klaar voor de volgende vraag
           this.play.player.current=Helpers.getPlayerWithLowestScore(this.remainingPlayersToGo)
           // console.log("speler met laagste score van togo - " + this.play.player.current)
           this.play.round.answered.push(this.play.question.current) // markeer beantwoorde vraag
           this.play.question.showAnswers=false   // verberg antwoorden
           this.resetQuestion()                   // reset vraag info
           if(!this.stillQuestions){ // zijn er nog vragen ?
             this.nextRound()
           }
           if(this.isRoundOpenDeur()){ // de opendeur vraag is vrij te kiezen
             this.play.question.current=-1
           }else{
             this.nextQuestion()    // de andere starten we met de volgende vraag
           }
           this.savePlay()
        },
        stopAnswers(){                // stop met antwoorden / of stop de clock met ticken
           this.stopClock()
           this.nextPlayer(true) // volgende speler
        },
        startAnswers(){               // start met antwoorden
           this.startClock()
        },
        isRound369(){
          return this.round.type=="369"
        },                // is dit een 369 ronde ?
        isRoundOpenDeur(){
          return this.round.type=="opendeur"
        },           // is dit de opendeur ronde ?
        isRoundPuzzel(){
          return this.round.type=="puzzel"
        },             // is dit de puzzel ronde ?
        isRoundGallerij(){
          return this.round.type=="gallerij"
        },           // is dit de gallerij ronde ?
        isRoundCollectiefGeheugen(){
          return this.round.type=="collectiefgeheugen"
        }, // is dit collectiefgeheugen ?
        isRoundFinale(){
          return this.round.type=="finale"
        },                    // is dit de finale ronde ?
        isFirstPlayer(){              // eerste speler aan zet ?
          return ((this.play.players.length-this.remainingPlayers.length)==0)
        },
        getOtherFinalPlayer(){        // wie is de andere finale speler ?
          return this.play.round.finalplayers.filter((player, index) => player.index!=this.play.player.current)[0].index
        },
        savePlay(score=undefined){                   // sla spelverloop op voor de deelnemersscherm
          Helpers.savePlay(this.play)
        },
        review(){                     // overloop vragen gallerij
          this.play.question.review=true
          this.play.question.answer=0
          this.savePlay()
        },
        startClock(){                 // start de klok
          this.play.question.clock=true
          this.savePlay()
          this.clockAudio=Helpers.playCountdown()  // speel geluidje
          if(!this.view)
            this.clock=setInterval(this.ticker,1000) // start met aftellen
        },
        stopClock(){
          this.play.question.clock=false // stop
          this.play.question.attempted.push(this.play.player.current) // als de klok stopt heeft de speler geprobeerd
          this.savePlay()
          if(this.clockAudio){           // stop geluid
              this.clockAudio.pause()
          }
          this.clockAudio=undefined
          Helpers.playStopClock()        // stop klok geluidje
          clearInterval(this.clock);     // stoppen aftellen
          this.clock=undefined
        },
        destroyClock(){               // stop klok indien er weg genavigeerd wordt
          // soms gebeurt er iets (vorige ronde ?) en dan zou de klok blijven lopen
          this.play.question.clock=false
          clearInterval(this.clock);     // stoppen aftellen
          this.clock=undefined
          if(this.clockAudio){           // stop geluid
              this.clockAudio.pause()
          }
        },
        ticker(){                     // seconde ticker
          if(this.play.question.clock && !this.play.question.finished){
            if(this.play.players[this.play.player.current].score>0){
              this.play.players[this.play.player.current].score-- // verlaag met 1
            }
            this.savePlay(this.play.players[this.play.player.current].score)
            if(this.isRoundFinale() && this.play.players[this.play.player.current].score<=0){ // finale en clock op ?
              this.itsDone(this.getOtherFinalPlayer()) // 't is gebeurd
            }
          }
        },
        itsDone(winner){              // 't is gebeurd
          this.play.winner=this.play.players[winner].name // zoek de winnaar
          this.play.question.finished=true // vraag beantwoord
          this.play.complete=true  // spel gedaan
          this.stopClock()         // stop clock
          Helpers.playEnd()        // speel eindtune
        }
    },
    beforeDestroy(){
      clearInterval(this.clock);     // stoppen aftellen
      this.clock=undefined
    }
  }
</script>
<style scoped>
  .is-disabled {
    color: currentColor;
    cursor: not-allowed;
    opacity: 0.5;
    text-decoration: none;
  }
  .navbar-item{
    color:white;
  }
  .logo{
    margin-top:3rem;
    width:100%;
    font-size:5rem;
    z-index:1;
    font-family: dslm, Ubuntu;
    transform: rotate(-5deg);
    color:#ffc500;
    line-height:5rem;
    text-shadow: -12px -12px 12px #000000;
    opacity:.3;
  }
  .logo .small{
    font-size:4rem;
  }
  .logo .top{
    vertical-align: text-top
  }
  .rounds{
    z-index:1000;
  }

</style>

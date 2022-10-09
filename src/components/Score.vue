<template>
  <div v-if="play.players">
    <!-- horizontal -->
    <div class="columns" v-if="layout=='horizontal'">
      <div class="column" v-for="player,index in play.players" :key="player.name">
        <PlayerScore
          :showActive="showActive && !(question && question.do)"
          :actionButtons="actionButtons"
          :player="player"
          :isCurrent="index==play.player.current"
          :doButton="question && question.do"
          :isDisabled="play.round.finalplayers.length>0 && !(play.round.finalplayers[0].index==index||play.round.finalplayers[1].index==index)"
          @correct="checkQuestion(true)"
          @fault="checkQuestion(false)"
          @check="checkQuestion(true,index)"
          :index="index"
        />
      </div>
    </div>
    <!-- vertical -->
    <div v-else>
      <Clock :quiz="quiz" :play="play" v-if="clock" :view="view"  @next="$emit('hideAnswers')" @stop="stopAnswers" @start="$emit('startAnswers')" @destroyClock="$emit('destroyClock')" />
      <div class="mb-1" v-for="player,index in play.players" :key="player.name">
        <PlayerScore
          v-if="showVerticalPlayer(index)"
          :isSmall="index!=play.player.current || play.question.finished"
          :player="player"
          :showActive="showActive && !play.question.finished"
          :isCurrent="index==play.player.current"
          :isDisabled="play.question.attempted.includes(index) && !play.question.finished"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Helpers from '../lib/Helpers'
  import Clock from './Clock.vue'
  import PlayerScore from './PlayerScore.vue'
  export default{
    name:"Score",
    components:{Clock,PlayerScore},
    props:{
      quiz:{type:Object},
      play:{type:Object},
      layout:{type:String},
      showActive:{type:Boolean,default:true},
      actionButtons:{type:Boolean,default:false},
      clock:{type:Boolean,default:false},
      view:{type:Boolean}
    },
    computed:{
      question(){ return Helpers.getQuestion(this.quiz,this.play)},
      round(){ return Helpers.getRound(this.quiz,this.play)}
    },
    data(){
      return  {
      }
    },
    methods:{
      getPoints(id){ return (((id+1)%3)==0)?10:0}, // Om de 3 vragen 10 punten te verdienen
      showVerticalPlayer(id){
        // toon niet huidige spelers tijdens klok loopt
        // indien geen clock, toon ze allemaal
        // als vraag gedaan is, toon ze allemaal
        var showPlayer=((id!=this.play.player.current && this.clock) || !this.clock || this.play.question.finished)
        // verberg niet finale spelers tijdens finale
        var showFinalPlayer=(this.round.type=="finale" && !this.isFinalPlayer(id))
        return showPlayer && !showFinalPlayer
      },
      isFinalPlayer(id){
        var findPlayer=this.play.round.finalplayers.filter((player, index) => player.index==id)
        return (findPlayer.length>0)
      },
      checkQuestion(ok,speler=undefined){
        this.$emit('checkQuestion',ok,speler);
      },
      stopAnswers(){
        this.$emit('stopAnswers');
      }
    }
  }
</script>
<style scoped>
  box.has-text-warning{
    border:2px solid #F2711C;
  }
</style>

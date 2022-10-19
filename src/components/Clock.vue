<template>
  <div>
    <!-- button next round -->
    <div v-if="play.question.finished && !(round.type=='gallerij' && !(play.question.review && lastQuestion)) && !view" class="mb-1 box darkbg">
      <template>
        <Keypress key-event="keydown" name="enter" :preventDefault="true" :key-code="13" @success="enter" />
      </template>
      <nav class="level" >
          <button class="level-item button is-warning is-radiusless"  @click="nextQuestion()">
            <span>
              Volgende [enter]
            </span>
            <span class="icon">
              <font-awesome-icon icon="arrow-right" />
            </span>
          </button>
      </nav>
    </div>
    <!-- clock -->
    <div v-if="!play.question.finished" class="mb-1">
      <div class="box darkbg has-text-centered mb-0 has-text-warning">
          <p class="score">{{player.score}}</p>
          <p class="player">{{ player.name }}</p>
      </div>
      <nav class="level" v-if="!(round.type=='gallerij' && isFirstPlayer) && !view"> <!-- gallerij eerste speler geen klok -->
          <template>
            <Keypress key-event="keydown" name="space" :preventDefault="true" :key-code="32" @success="space" />
          </template>
          <button class="level-item button is-danger is-radiusless" v-if="isClockRunning" @click="stop()">
            <span class="icon">
              <font-awesome-icon icon="stop" />
            </span>
            <span>
              Stop klok [spatie]
            </span>
          </button>
          <button class="level-item button is-success is-radiusless" v-else @click="start()">
            <span class="icon">
              <font-awesome-icon icon="play" />
            </span>
            <span>
              Start klok [spatie]
            </span>
          </button>
      </nav>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Helpers from '../lib/Helpers'
  import Keypress from './VueKeyPress.vue'
  export default{
    name:"Clock",
    components:{Keypress},
    props:{
      quiz:{type:Object},
      play:{type:Object},
      clock:{type:Boolean,default:false},
      view:{type:Boolean}
    },
    computed:{
      player(){ return Helpers.getPlayer(this.quiz,this.play)},
      lastQuestion() {return this.play.question.answer==(this.question.answers.length-1)},
      question() {return Helpers.getQuestion(this.quiz,this.play)},
      isFirstPlayer() { return this.play.question.attempted.length==0},
      isClockRunning() { return this.play.question.clock},
      round() { return Helpers.getRound(this.quiz,this.play)}
    },
    data(){
      return  {
      }
    },
    methods:{
      stop(){
        this.$emit('stop')
      },
      start(){
        this.$emit('start')
      },
      space(){
        if(!this.play.question.finished){
          if(this.isClockRunning){
            this.stop()
          }else{
            this.start()
          }
        }
      },
      nextQuestion(){
        this.$emit('next')
      },
      enter(){
          if(this.play.question.finished && !(this.round.type=='gallerij' && !(this.play.question.review && this.lastQuestion)) && !this.view){
            this.nextQuestion()
          }
      }
    },
    beforeDestroy() {
      this.$emit('destroyClock') // stop clock, but just ticker and sound
    },
  }
</script>
<style scoped>
  box.has-text-warning{
    border:2px solid #F2711C;
  }
</style>

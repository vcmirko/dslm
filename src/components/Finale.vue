<template>
  <div>
    <template v-if="!play.question.showAnswers">
      <div class="columns mt-5">
        <div class="column is-half is-offset-one-quarter is-size-4 has-text-centered">
          <div class="box darkbg mb-0">
            <p class="score">{{ play.players[play.player.current].score }}</p>
            <p class="is-uppercase">{{ play.players[play.player.current].name }}</p>
          </div>
          <nav class="level" v-if="!view">
              <template>
                <Keypress key-event="keydown" name="space" :preventDefault="true" :key-code="32" @success="$emit('showAnswers',play.question.current)" />
              </template>
              <button class="level-item button is-success is-radiusless" @click="$emit('showAnswers',play.question.current)">
                <span class="icon">
                  <font-awesome-icon icon="play" />
                </span>
                <span>
                  Start klok [space]
                </span>
              </button>
          </nav>
          <div class="box darkbg mt-2" v-if="!view">
             {{ question.name }}
          </div>
          <p class="has-text-centered has-text-white mt-3" v-if="question.help">
            <span class="icon-text">
              <span class="icon is-size-3"><font-awesome-icon icon="circle-info" /></span>
              <span class="is-size-4">{{ question.help}}</span>
            </span>
          </p>
        </div>
      </div>
    </template>
    <div class="columns" v-else>
      <div class="column">
        <p class="box darkbg is-size-5">
          {{ question.name }}
        </p>
        <Answers :quiz="quiz" :play="play" :view="view" @markAnswered="markAnswered" />
      </div>
      <div class="column is-one-third">
          <Score :quiz="quiz" :play="play" layout="vertical" :view="view" :clock="true" @stopAnswers="$emit('stopAnswers')" @startAnswers="$emit('startAnswers')" @hideAnswers="$emit('hideAnswers')" @destroyClock="$emit('destroyClock')"></Score>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Helpers from '../lib/Helpers'
  import Score from './Score.vue'
  import Answers from './Answers.vue'
  import Media from './Media.vue'
  import Keypress from './VueKeyPress.vue'
  export default{
    name:"Finale",
    components:{Score,Answers,Keypress},
    props:{
      quiz:{type:Object},
      play:{type:Object},
      view:{type:Boolean}
    },
    computed:{
      question(){ return Helpers.getQuestion(this.quiz,this.play) },
      remainingAnswers() { return Helpers.getRemainingAnswers(this.quiz,this.play)},
      round(){ return Helpers.getRound(this.quiz,this.play)},
      answers(){ return Helpers.getAnswers(this.quiz,this.play)}
    },
    methods:{
      markAnswered(index){
        if(!this.play.question.finished){
          this.$emit('checkAnswer',index,-20)
        }else{
          // console.log("Question finished !")
        }
      },
      answeredPlayer(index){ return Helpers.getAnsweredPlayer(this.play,index)}
    }
  }
</script>
<style scoped>
  .table{
    border-collapse: separate;
    background:transparent!important;
  }
  .table td{
    border:1px solid rgba(34,36,38,.1)!important;
    background:transparent!important;
    color:white;
  }
</style>

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
        </div>
      </div>
    </template>
    <div class="columns" v-else>
      <div class="column">
        <p class="box darkbg is-size-5">
          <table class="table is-fullwidth is-bordered is-transparent has-text-centered">
              <tr v-for="i in 4" :key="'row'+i">
                <td v-for="j in 3" :key="'col'+i+j"
                  class="is-size-4"
                  :class="{'has-text-link':play.question.words[(i-1)*3+(j-1)].includes('w1') && answers.includes(0),'has-text-success':play.question.words[(i-1)*3+(j-1)].includes('w2') && answers.includes(1),'has-text-info':play.question.words[(i-1)*3+(j-1)].includes('w3') && answers.includes(2)}"
                >{{ question.words[play.question.words[(i-1)*3+(j-1)]] }}</td>
              </tr>
          </table>
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
  import Keypress from 'vue-keypress'
  export default{
    name:"Puzzel",
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
          this.$emit('checkAnswer',index,30)
        }else{
          // console.log("Question finished !")
        }
      },
      answeredPlayer(index){ return Helpers.getAnsweredPlayer(this.play,index)},
      isAntwoord1(index){this.play.question.words[index].includes('w1')},
      isAntwoord2(index){this.play.question.words[index].includes('w2') && this.answers.includes(1)},
      isAntwoord3(index){this.play.question.words[index].includes('w3') && this.answers.includes(2)}
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

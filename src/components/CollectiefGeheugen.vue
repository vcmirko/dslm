<template>
  <div>
    <div class="box darkbg" v-if="view && play.question.showMedia && !play.question.showAnswers">
      <Media :question="question" />
    </div>
    <template v-else>
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
                  <Keypress key-event="keydown" name="enter" :preventDefault="true" :key-code="13" @success="$emit('showMedia')" />
                </template>
                <button class="level-item button is-success is-radiusless" @click="$emit('showAnswers',play.question.current)">
                  <span class="icon">
                    <font-awesome-icon icon="play" />
                  </span>
                  <span>
                    Start klok [spatie]
                  </span>
                </button>
                <button class="level-item button is-radiusless" :class="play.question.showMedia?'is-danger':'is-link'" @click="$emit('showMedia')">
                  <span class="icon is-size-3"><font-awesome-icon icon="film" /></span>
                  <span>{{ (play.question.showMedia)?'Verberg filmpje':'Speel filmpje' }} [enter]</span>
                </button>
            </nav>
          </div>
        </div>
      </template>
      <div class="columns" v-else>
        <div class="column">
          <p class="box darkbg is-size-5" v-if="!view">
            {{ question.name }}
          </p>
          <Answers :quiz="quiz" :play="play" :view="view" @markAnswered="markAnswered" />
        </div>
        <div class="column is-one-third">
            <Score :quiz="quiz" :play="play" layout="vertical" :view="view" :clock="true" @stopAnswers="$emit('stopAnswers')" @startAnswers="$emit('startAnswers')" @hideAnswers="$emit('hideAnswers')" @destroyClock="$emit('destroyClock')"></Score>
        </div>
      </div>
    </template>
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
    name:"CollectiefGeheugen",
    components:{Score,Media,Answers,Keypress},
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
          this.$emit('checkAnswer',index,(this.play.question.found.length+1)*10)
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

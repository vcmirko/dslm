<template>
  <div>
    <div class="box darkbg" v-if="view && play.question.showMedia && !play.question.showAnswers">
      <Media :question="question" />
    </div>
    <template v-else>
      <div v-if="!play.question.showAnswers">
        <div class="columns">
          <div class="column has-text-centered" v-for="(q,index) in round.questions" :key="index">
            <template>
              <Keypress key-event="keydown" name="num1" :preventDefault="true" :key-code="48+((index+1)%10)" @success="$emit('showMedia',index)" />
              <Keypress key-event="keydown" name="num2" :preventDefault="true" :key-code="96+((index+1)%10)" @success="$emit('showMedia',index)" />
            </template>
            <figure v-if="!play.round.answered.includes(index)" @click="$emit('showMedia',index)" class="image is-3by2 is-clickable">
              <img :src="q.preview" style="object-fit: cover;">
              <span v-if="!view" class="is-overlay is-link tag">[ {{ index+1 }} ]</span>
            </figure>
            <figure v-else class="image is-3by2 is-flew">
              <img :src="q.preview" style="object-fit: cover;">
            </figure>
            <nav class="level" v-if="(index==play.question.current) && !play.question.finished && !view">
                <template>
                  <Keypress key-event="keydown" name="space" :preventDefault="true" :key-code="32" @success="$emit('showAnswers',index)" />
                </template>
                <button class="level-item button is-success is-radiusless" @click="$emit('showAnswers',index)">
                  <span class="icon">
                    <font-awesome-icon icon="play" />
                  </span>
                  <span>Start de klok [space]</span>
                </button>
            </nav>
          </div>
        </div>
        <Score :quiz="quiz" :play="play" layout="horizontal" @destroyClock="$emit('destroyClock')"></Score>
      </div>
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
    name:"Opendeur",
    components:{Score,Media,Answers,Keypress},
    props:{
      quiz:{type:Object},
      play:{type:Object},
      view:{type:Boolean}
    },
    computed:{
      question(){ return Helpers.getQuestion(this.quiz,this.play) },
      remainingAnswers() { return Helpers.getRemainingAnswers(this.quiz,this.play)},
      round(){ return Helpers.getRound(this.quiz,this.play)}
    },
    methods:{
      markAnswered(index){
        if(!this.play.question.finished && this.play.question.clock){
          this.$emit('checkAnswer',index,15)
        }
      },
      answeredPlayer(index){ return Helpers.getAnsweredPlayer(this.play,index)}
    }
  }
</script>
<style scoped>

</style>

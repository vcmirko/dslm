<template>
  <div>
    <div class="box darkbg" v-if="view && play.question.showMedia">
      <Media :question="question" />
    </div>
    <template v-else>
      <div>
        <Score :quiz="quiz" :play="play" layout="horizontal" :actionButtons="true && !view" @checkQuestion="checkQuestion" @destroyClock="$emit('destroyClock')"></Score>
      </div>
      <div v-if="!view">
        <p class="has-text-centered is-size-3">{{ (play.question.current+1) }}. {{ question.name}}</p>
        <p class="has-text-centered has-text-warning mt-3">
          <span class="icon-text">
            <span class="icon is-size-3"><font-awesome-icon icon="arrow-right" /></span>
            <span class="is-size-4">{{ question.answer}}</span>
          </span>
        </p>
        <p class="has-text-centered has-text-white mt-3" v-if="question.help">
          <span class="icon-text">
            <span class="icon is-size-3"><font-awesome-icon icon="circle-info" /></span>
            <span class="is-size-4">{{ question.help}}</span>
          </span>
        </p>
        <p class="has-text-centered mt-3" v-if="question.media">
          <template>
            <Keypress key-event="keydown" name="space" :preventDefault="true" :key-code="13" @success="$emit('showMedia')" />
          </template>
          <button class="button" :class="play.question.showMedia?'is-danger':'is-success'" @click="$emit('showMedia')"><span class="icon is-size-3"><font-awesome-icon :icon="(question.mediatype=='audio')?'volume-up':question.mediatype" /></span><span>{{ play.question.showMedia?'Verberg media':(question.mediatype=='image')?'Toon media':'Speel media'}} [enter]</span></button>
        </p>
      </div>
      <div class="container has-text-centered">
            <span class="has-text-centered is-inline-block px-3"
              v-for="(q,index) in round.questions"
              :key="index"
              :class="{'has-text-warning':index==play.question.current,'is-large':getPoints(index)>0,'mb-3':getPoints(index)>0,'is-flew':getPoints(index)==0}"
            >
              {{index+1}}
            </span>
      </div>
    </template>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Helpers from '../lib/Helpers'
  import Score from './Score.vue'
  import Media from './Media.vue'
  import Keypress from 'vue-keypress'
  export default{
    name:"R369",
    components:{Score,Media,Keypress},
    props:{
      quiz:{type:Object},
      play:{type:Object},
      view:{type:Boolean}
    },
    computed:{
      question(){ return Helpers.getQuestion(this.quiz,this.play)},
      round(){ return Helpers.getRound(this.quiz,this.play)}
    },
    methods:{
      getPoints(id){ return (((id+1)%3)==0)?10:0}, // Om de 3 vragen 10 punten te verdienen
      checkQuestion(ok,speler=undefined){
        this.$emit('checkQuestion',ok,this.getPoints(this.play.question.current),speler)
      }
    }
  }
</script>
<style scoped>
</style>

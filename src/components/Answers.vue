<template>
    <div class="box darkbg is-size-3">
      <p @click="markAnswered(index)" v-for="(answer,index) in question.answers" :key="index" class="is-clickable">
        <template v-if="!view">
          <Keypress key-event="keydown" :name="'key'+index" :preventDefault="true" :key-code="48+((index+1)%10)" @success="markAnswered(index)" />
          <Keypress key-event="keydown" :name="'key2'+index" :preventDefault="true" :key-code="96+((index+1)%10)" @success="markAnswered(index)" />
        </template>
        <span class="icon-text">
          <span class="has-text-warning is-fixed-width-small is-inline-block" v-if="answeredPoints(index)">{{ answeredPoints(index) }}</span>
          <span class="is-fixed-width-small is-inline-block" v-else><span v-if="!play.question.finished && !view">[{{ ((index+1)%10) }}]</span></span>
          <span
            class="mr-3"
            :class="{'blur':!answeredPoints(index)&& !play.question.finished && view,'is-line-through':answeredPoints(index)&& !play.question.finished && !view,'has-text-link':hasPuzzelLink1(index),'has-text-success':hasPuzzelLink2(index),'has-text-info':hasPuzzelLink3(index)}"
            >{{ answer.name }}</span>
          <span v-if="answeredPoints(index)" class="tag is-success">{{ answeredPlayer(index) }}</span>
        </span>
      </p>
      <span class="tag is-warning">{{ play.question.found.length }}/{{ question.answers.length }}</span>
    </div>
</template>
<script>
  import Vue from 'vue'
  import Helpers from '../lib/Helpers'
  import Keypress from 'vue-keypress'
  export default{
    name:"Answers",
    components:{Keypress},
    props:{
      quiz:{type:Object},
      play:{type:Object},
      view:{type:Boolean}
    },
    computed:{
      question(){ return Helpers.getQuestion(this.quiz,this.play) },
      round(){ return Helpers.getRound(this.quiz,this.play)},
      isPuzzelRound(){ return this.round.type=="puzzel"}
    },
    data(){
      return  {
      }
    },
    methods:{
      markAnswered(index){
        if(!this.play.question.finished && this.play.question.clock && !this.view){
          this.$emit('markAnswered',index)
        }
      },
      answeredPlayer(index){ return Helpers.getAnsweredPlayer(this.play,index)},
      answeredPoints(index){ return Math.abs(Helpers.getAnsweredPoints(this.play,index))},
      hasPuzzelLink1(index){ return this.isPuzzelRound && (index==0) && this.answeredPoints(index) },
      hasPuzzelLink2(index){ return this.isPuzzelRound && (index==1) && this.answeredPoints(index) },
      hasPuzzelLink3(index){ return this.isPuzzelRound && (index==2) && this.answeredPoints(index) }
    }
  }
</script>
<style scoped>
  .is-fixed-width-small{
    width:50px;
  }
  .is-line-through{
    text-decoration: line-through
  }
  .blur{
    filter:blur(10px);
    color:black!important;
  }
</style>

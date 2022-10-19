<template>
  <div>
    <div>
      <div class="has-text-centered mb-3 roundTitle is-family-secondary">{{ round.name }}</div>
      <Score :quiz="quiz" :play="play" layout="horizontal" :showActive="false" @destroyClock="$emit('destroyClock')"></Score>
    </div>
    <div class="has-text-centered mt-6" v-if="!view">
      <template>
        <Keypress key-event="keydown" name="links" :key-code="37" @success="playIntro()" />
        <Keypress key-event="keydown" name="enter" :preventDefault="true" :key-code="13" @success="startRound()" />
        <Keypress v-if="round.type=='369'" key-event="keydown" name="rechts" :preventDefault="true" :key-code="39" @success="giveStartScore()" />
      </template>
      <button class="button is-action is-link is-medium mr-3" @click="playIntro()">
        <span>Muziekje [links]</span>
        <span class="icon">
          <font-awesome-icon icon="music" />
        </span>
      </button>
      <button v-if="round.type=='369'" class="button is-action is-success is-medium mr-3" @click="giveStartScore()">
        <span>Geef start seconden [rechts]</span>
        <span class="icon">
          <font-awesome-icon icon="hourglass-start" />
        </span>
      </button>
      <button class="button is-action is-warning is-medium" @click="startRound()">
        <span>Start ronde [enter]</span>
        <span class="icon">
          <font-awesome-icon icon="arrow-right" />
        </span>
      </button>
    </div>
    <div class="columns mt-5">
      <div class="column box darkbg is-half is-offset-one-quarter is-size-4">
        {{ round.description }}
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Helpers from '../lib/Helpers'
  import Score from './Score.vue'
  import Keypress from './VueKeyPress.vue'
  export default{
    name:"Summary",
    components:{Score,Keypress},
    props:{
      quiz:{type:Object},
      play:{type:Object},
      view:{type:Boolean}
    },
    computed:{
      round(){ return Helpers.getRound(this.quiz,this.play)}
    },
    data(){
      return  {
        audio:undefined
      }
    },
    methods:{
      startRound(){
        this.$emit("startRound")
        if(this.audio){
          this.audio.pause();
        }
      },
      giveStartScore(){
        this.$emit("startScore")
      },
      playIntro(){
        this.audio = Helpers.playIntro()
      }
    },
    mounted(){
    }
  }
</script>
<style scoped>
</style>

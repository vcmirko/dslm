<template>
  <div>
      <div class="box darkbg has-text-centered mb-0" :class="{'has-text-warning':showActive && isCurrent,'is-flew':isDisabled}">
          <p :class="{'score':!isSmall}">{{player.score}}</p>
          <p class="player">{{ player.name }}</p>
      </div>
      <template v-if="actionButtons">
        <nav class="level" v-if="isCurrent && !doButton">
            <template>
              <Keypress key-event="keydown" name="left" :preventDefault="true" :key-code="37" @any="keydown" />
            </template>
            <button class="level-item button is-success is-radiusless" @click="$emit('correct')">
              <span class="icon">
                <font-awesome-icon icon="check" />
              </span>
              <span>[links]</span>
            </button>
            <button class="level-item button is-danger is-radiusless" @click="$emit('fault')">
              <span class="icon">
                <font-awesome-icon icon="times" />
              </span>
              <span>[rechts]</span>
            </button>
        </nav>
        <nav class="level" v-if="doButton">
            <template>
              <Keypress key-event="keydown" name="num1" :preventDefault="true" :key-code="48+((index+1)%10)" @success="$emit('check')" />
              <Keypress key-event="keydown" name="num2" :preventDefault="true" :key-code="96+((index+1)%10)" @success="$emit('check')" />
            </template>
            <button class="level-item button is-success is-radiusless" @click="$emit('check')">
              <span class="icon">
                <font-awesome-icon icon="check" />
              </span>
              <span>
                [ {{ index+1 }} ]
              </span>
            </button>
        </nav>
      </template>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Helpers from '../lib/Helpers'
  import Keypress from 'vue-keypress'
  export default{
    name:"PlayerScore",
    components:{Keypress},
    props:{
      showActive:{type:Boolean,default:true},
      actionButtons:{type:Boolean,default:false},
      doButton:{type:Boolean,default:false},
      isSmall:{type:Boolean,default:false},
      isDisabled:{type:Boolean,default:false},
      player:{type:Object},
      isCurrent:{type:Boolean,default:false},
      index:{type:Number}
    },
    computed:{
    },
    data(){
      return  {
      }
    },
    methods:{
      keydown(e){
        if(e.event.keyCode=='37'){
          this.$emit('correct')
        }
        if(e.event.keyCode=='39'){
          this.$emit('fault')
        }
      }
    }
  }
</script>
<style scoped>
  .box.has-text-warning{
    border-top:2px solid #F2711C!important;
  }
</style>

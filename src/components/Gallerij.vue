<template>
  <div>
    <template v-if="!isReview">
      <template v-if="!play.question.showAnswers">
        <div class="columns mt-5">
          <div class="column is-half is-offset-one-quarter is-size-4 has-text-centered">
            <div class="box darkbg mb-0">
              <p class="score">{{ play.players[play.player.current].score }}</p>
              <p class="is-uppercase">{{ play.players[play.player.current].name }}</p>
            </div>
            <nav class="level" v-if="!view">
                <template>
                  <Keypress key-event="keydown" name="space" :preventDefault="true" :key-code="32" @any="showAnswers" />
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
          </div>
        </div>
      </template>
      <template v-else>
        <div class="columns">
          <div class="column" v-if="isFirstPlayer">
            <div class="box darkbg is-size-5 mb-0" v-if="!view">
              {{ answer.name }}
            </div>
            <template>
              <Keypress key-event="keydown" name="leftKey" :preventDefault="true" :key-code="37" @success="$emit('checkAnswer',play.question.answer,15)" />
              <Keypress key-event="keydown" name="rightKey" :preventDefault="true" :key-code="39" @success="$emit('checkAnswer',play.question.answer,0)" />
            </template>
            <nav class="level" v-if="!view">
                <button class="level-item button is-success is-radiusless" @click="$emit('checkAnswer',play.question.answer,15)">
                  <span>[left arrow]</span>
                  <span class="icon">
                    <font-awesome-icon icon="check" />
                  </span>
                </button>
                <button class="level-item button is-danger is-radiusless" @click="$emit('checkAnswer',play.question.answer,0)">
                  <span class="icon">
                    <font-awesome-icon icon="times" />
                  </span>
                  <span>[right arrow]</span>
                </button>
            </nav>
            <div class="box darkbg">
              <figure class="image">
                <img :src="answer.media" />
              </figure>
            </div>
          </div>
          <div class="column" v-else>
            <div class="box darkbg" v-if="play.question.finished && !view">
              <nav class="level">
                <template>
                  <Keypress key-event="keydown" name="enter" :preventDefault="true" :key-code="13" @success="$emit('review')" />
                </template>
                <button class="level-item button is-success" @click="$emit('review')">
                  <span>Foto's overlopen [enter]</span>
                  <span class="icon">
                    <font-awesome-icon icon="check" />
                  </span>
                </button>
              </nav>
            </div>
            <Answers :quiz="quiz" :play="play" :view="view" @markAnswered="markAnswered" />
          </div>
          <div class="column is-one-third">
              <Score :quiz="quiz" :play="play" layout="vertical" :view="view" :clock="true" @stopAnswers="$emit('stopAnswers')" @startAnswers="$emit('startAnswers')" @hideAnswers="$emit('hideAnswers')" @destroyClock="$emit('destroyClock')"></Score>
          </div>
        </div>
      </template>
    </template>
    <template v-else> <!-- review -->
      <div class="columns">
        <div class="column">
          <div class="box darkbg is-size-5 mb-0">
            <span class="mr-2">{{ answer.name }}</span>
            <span v-if="answeredPlayer(play.question.answer)" class="tag is-success">{{ answeredPlayer(play.question.answer) }}</span>
            <span v-else class="tag is-danger">Niet gevonden</span>
          </div>
          <nav class="level" v-if="!view">
            <template>
              <Keypress key-event="keydown" name="leftKey" :preventDefault="true" :key-code="37" @success="$emit('previousAnswer')" />
              <Keypress key-event="keydown" name="rightKey" :preventDefault="true" :key-code="39" @success="nextAnswer()" />
            </template>
            <button :class="{'is-disabled':!(play.question.answer>0)}" class="level-item button is-warning is-radiusless" @click="$emit('previousAnswer')">
              <span class="icon">
                <font-awesome-icon icon="arrow-left" />
              </span>
              <span>
                Vorige
              </span>
            </button>
              <button :class="{'is-disabled':!(play.question.answer<(question.answers.length-1))}" class="level-item button is-success is-radiusless" @click="nextAnswer()">
                <span>
                  Volgende
                </span>
                <span class="icon">
                  <font-awesome-icon icon="arrow-right" />
                </span>
              </button>
          </nav>
          <div class="box darkbg">
            <figure class="image">
              <img :src="answer.review?answer.review:answer.media" />
            </figure>
          </div>
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
  import Keypress from 'vue-keypress'
  export default{
    name:"Gallerij",
    components:{Score,Answers,Keypress},
    props:{
      quiz:{type:Object},
      play:{type:Object},
      view:{type:Boolean}
    },
    computed:{
      question(){ return Helpers.getQuestion(this.quiz,this.play) },
      remainingAnswers() { return Helpers.getRemainingAnswers(this.quiz,this.play)},
      remainingPlayers() { return Helpers.getRemainingPlayers(this.quiz,this.play)},
      answer() { return Helpers.getAnswer(this.quiz,this.play)},
      round(){ return Helpers.getRound(this.quiz,this.play)},
      isFirstPlayer(){
        return ((this.play.players.length-this.remainingPlayers.length)==0)
      },
      isReview(){ return this.play.question.review}

    },
    methods:{
      markAnswered(index){
        if(!this.play.question.finished){
          this.$emit('checkAnswer',index,30)
        }
      },
      answeredPlayer(index){ return Helpers.getAnsweredPlayer(this.play,index)},
      nextAnswer(){
        if(this.play.question.answer<(this.question.answers.length-1)){
          this.$emit('nextAnswer')
        }
      },
      showAnswers(response){
        if(event.keyCode==32)
          this.$emit('showAnswers',this.play.question.current)
      }
    }
  }
</script>
<style scoped>
  figure img{
    max-height:60vh;
    object-fit: contain;
  }
  .is-disabled {
    color: currentColor;
    cursor: not-allowed;
    opacity: 0.5;
    text-decoration: none;
  }
</style>

<template>
<div class="container">
  <div class="has-text-centered">
    <div class="logo has-text-centered mb-6"><span class="small">de</span> <span>SLIMSTE</span><br><span>MENS </span><span class="top small">ter wereld</span></div>
    <div class="box darkbg" v-if="!newQuiz">
      <div class="box has-background-white has-text-left has-text-dark is-inline-block" style="width:500px">
        Welkom bij de slimste mens ter wereld.<br>
        De quiz moet je met de designer aanmaken (links onder).<br>
        Met de designer kan je een quiz volledig naar je hand zetten.<br>
        Je moet dus alle vragen, antwoorden en media invullen.<br>
        Je kan de quiz ook exporteren of importeren.<br>
        De quiz moet je met de designer eerst opladen, deze wordt dan in het geheugen van de browser geladen.<br>
        Het spelverloop zelf wordt ook steeds opgeslagen, je kan dus de laatste quiz steeds hernemen.<br>
        Of je kan kiezen om een nieuw spelverloop te starten.
      </div>
      <div>
        <router-link to="/quizmaster" class="button is-medium is-warning mb-2"><span>Ga verder met bestaande quiz </span><span class="icon">
            <font-awesome-icon icon="redo" />
          </span></router-link><br>
        <button class="button is-medium is-success" @click="newQuiz=true"><span>Start nieuwe quiz </span><span class="icon">
            <font-awesome-icon icon="arrow-right" />
          </span></button>
      </div>
    </div>
    <div class="box darkbg" v-else>
      <div class="columns">
        <div class="column">
          <div class="box has-background-white has-text-left has-text-dark">
            <h2 class="is-family-secondary is-size-3 mb-2">Quiz info</h2>
            <div class="field" v-for="player,index in play.players" :key="'player'+index">
              <label class="label">Speler {{(index+1)}}</label>
              <p class="control">
                <input class="input" type="text" placeholder="Spelernaam" v-model="play.players[index].name">
              </p>
            </div>
            <div class="field">
              <p class="control">
                <button class="button is-success" @click="toggleNumberOfPlayers()">
                  {{ (this.play.players.length==3)?"4":"3" }} spelers
                </button>
              </p>
            </div>
            <div class="field">
              <label class="label">Finale wordt gespeeld door</label>
              <div class="control">
                <label class="radio">
                  <input type="radio" name="winners" value="winners" v-model="play.final">
                  2 winnaars
                </label>
                <label class="radio">
                  <input type="radio" name="losers" value="losers" v-model="play.final">
                  2 verliezers
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="box has-background-white has-text-left has-text-dark">
            <h2 class="is-family-secondary is-size-3 mb-2">Parameters oorkonde</h2>
            <div class="field">
              <label class="label">De slimste mens van ... wat ?</label>
              <p class="control">
                <input class="input" type="text" placeholder="De slimste mens... vul aan (ter wereld, ...)" v-model="play.bestof">
              </p>
            </div>
            <div class="field">
              <label class="label">Wanneer ? (voor oorkonde)</label>
              <p class="control">
                <input class="input" type="text" placeholder="Op kerstavond bij Lotje" v-model="play.when">
              </p>
            </div>
            <div class="field">
              <label class="label">Sfeer (voor oorkonde)</label>
              <p class="control">
                <input class="input" type="text" placeholder="na menige hapjes en drankjes" v-model="play.circumstances">
              </p>
            </div>
            <div class="field">
              <label class="label">Winnaar krijgt ? (voor oorkonde)</label>
              <p class="control">
                <input class="input" type="text" placeholder="Met felicitaties van de jury" v-model="play.winnerGets">
              </p>
            </div>
            <div class="field">
              <label class="label">Naam quizmaster (voor oorkonde)</label>
              <p class="control">
                <input class="input" type="text" placeholder="Naam quizmaster (oorkonde)" v-model="play.quizmaster">
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button class="button is-medium is-success" @click="startQuiz()"><span>Start quiz </span><span class="icon">
            <font-awesome-icon icon="arrow-right" />
          </span></button>
      </div>
    </div>
  </div>
  <nav class="navbar is-fixed-bottom is-primary is-mobile">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/designer">
        <span class="icon">
          <font-awesome-icon icon="pencil-alt" />
        </span><span>Designer</span>
      </router-link>
    </div>
  </nav>
</div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import Helpers from './../lib/Helpers'
export default {
  components: {},
  name: "Home",
  props: {},
  data() {
    return {
      newQuiz: false,
      quiz:{},
      play: {
        bestof: "ter wereld",
        final: "winners",
        when: "Op een gezellige avond",
        circumstances: "in leuk en knap gezelschap",
        quizmaster: "Mirko",
        winnerGets: "Met felicitaties van de jury",
        showFinalAnswers: false,
        complete: false,
        players: [{
          name: "",
          score: 0
        }, {
          name: "",
          score: 0
        }, {
          name: "",
          score: 0
        }],
        round: {
          current: 0,
          complete: false,
          started: false,
          played: [],
          answered: [],
          finalplayers: []
        },
        player: {
          current: 0,
          lastsuccess: 0
        },
        question: {
          current: 0,
          attempted: [],
          finished: false,
          found: [],
          showMedia: false,
          showAnswers: false,
          answer: 0,
          clock: false,
          review: false
        }
      }
    }
  },
  computed: {},
  watch: {},
  beforeMount() {},
  mounted() {
    this.quiz=Helpers.loadQuiz()
  },
  methods: {
    toggleNumberOfPlayers() {
      if (this.play.players.length == 3) {
        this.play.players.push({
          name: "",
          score: 0
        })
        Vue.set(this.play.players[3],'score',0)
      } else {
        this.play.players.pop()
      }
    },
    startQuiz() {
      var quiz = Helpers.loadQuiz()
      var validation = Helpers.validateQuiz(quiz)
      if(validation!=""){
        this.$toast.error(validation)
      }else{
        this.play.players.forEach(function(player, index) {
          if (player.name == "") {
            player.name = "Speler " + (index + 1)
          }
        })
        Helpers.savePlay(this.play)
        this.$router.push({
          name: "Quizmaster"
        }).catch(err => {});
      }
    }
  }

}
</script>
<style scoped>
.navbar-item {
  color: white;
}

.logo {
  margin-top: 3rem;
  width: 100%;
  font-size: 5rem;
  z-index: 1;
  font-family: dslm, Ubuntu;
  transform: rotate(-5deg);
  color: #ffc500;
  line-height: 5rem;
  text-shadow: -12px -12px 12px #000000;
  opacity: .3;
}

.logo .small {
  font-size: 4rem;
}

.logo .top {
  vertical-align: text-top
}

.rounds {
  z-index: 1000;
}
</style>

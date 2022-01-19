<template>
  <section class="section">
    <div class="container">
      <h1 class="title has-text-white"><font-awesome-icon icon="edit" /> Designer</h1>
      <!-- back to home -->
      <router-link class="button is-warning mb-2 mr-2" to="/">
        <span class="icon"><font-awesome-icon icon="home" /></span><span>Home</span>
      </router-link>
      <!-- top links -->
      <BulmaButton v-if="!isImportquiz" @click="isImportquiz=true;quizraw=''" icon="file-import" label="Import Quiz" />
      <BulmaButton v-if="isImportquiz" @click="isImportquiz=false;" type="is-danger" icon="times" label="Terug naar designer" />
      <!-- designer -->
      <div v-if="quiz && !isImportquiz" class="box has-background-white">
        <!-- media preview -->
        <MediaPreview :currentQuestion="currentQuestion" :type="mediatype" v-if="previewMedia" @close="previewMedia=false" />
        <!-- quiz buttons -->
        <BulmaButton type="is-warning" icon="redo" label="Reset Quiz" @click="resetQuiz()" />
        <BulmaButton type="is-info" icon="file-export" label="Exporteer Quiz" @click="exportQuiz()" />
        <BulmaButton type="is-success" icon="save" label="Quiz opladen voor spel" @click="saveQuiz()" />
        <!-- round nav -->
        <div class="tabs">
          <ul>
            <li v-for="(round,index) in quiz.rounds" :key="'round'+index" :class="{'is-active':index==currentRound}"><a @click="currentRound=index;currentRoundType=round.type;focusQuestion=0">{{ round.name }}</a></li>
          </ul>
        </div>
        <!-- designer fields -->
        <div class="box has-background-grey-lighter">
          <div
            v-for="(question,index) in quiz.rounds[currentRound].questions"
            :tabindex="index"
            class="box mt-3"
            :class="{'has-background-success-light':focusQuestion==index}"
            @focus="focusQuestion=index"
            @click="focusQuestion=index"
            :key="'question'+index">
            <div class="field">
              <label class="label question">Vraag {{ (index+1) }}
                <BulmaButton type="has-text-success" icon="arrow-down" iconOnly @click.stop="move(index,1)" />
                <BulmaButton type="has-text-primary" icon="arrow-up" iconOnly @click.stop="move(index,-1)" />
                <BulmaButton v-if="currentRoundType=='finale'" type="has-text-danger ml-5" icon="times" iconOnly @click="removeFinalQuestion(index)" />
                <BulmaButton v-if="currentRoundType=='finale'" type="has-text-success" icon="plus" iconOnly @click="addFinalQuestion(index)" />
              </label>
              <BulmaInput :placeholder="'Vraag ' + (index+1)" v-model="quiz.rounds[currentRound].questions[index].name" icon="question" :required="true" />
            </div>
            <template v-if="currentRoundType=='opendeur'">
              <div class="field">
                <BulmaInput icon="image" placeholder="/media/opendeur/preview.jpg" v-model="quiz.rounds[currentRound].questions[index].preview" :required="true" @blur="autoAddMedia(index)" />
              </div>
              <div class="field">
                <BulmaInput icon="image" placeholder="/media/opendeur/opendeur.mp4" v-model="quiz.rounds[currentRound].questions[index].media" :required="true" />
              </div>
              <div class="control mt-2">
                <BulmaButton v-if="question.preview!=''" icon="image" label="Toon preview" @click="currentQuestion=question;showMedia();mediatype='preview'" />
                <BulmaButton v-if="question.media!=''" icon="film" label="Speel media" @click="currentQuestion=question;showMedia();mediatype='player'" />
              </div>
            </template>
            <template v-if="currentRoundType=='puzzel'">
              <div class="field" v-for="(answer,index2) in question.answers" :key="'puzzel'+index+'_'+index2" >
                <h1 class="is-size-5">Term {{ (index2+1) }}</h1>
                <BulmaInput icon="thumbs-up" :placeholder="'Antwoord ' + (index2+1)" v-model="quiz.rounds[currentRound].questions[index].answers[index2].name" :required="true" />
                <!-- key woorden -->
                <div class="columns mt-0">
                  <div class="column" v-for="index3 in 4" :key="'puzzel'+index+'_'+index2+'_'+index3">
                    <BulmaInput  icon="lightbulb" :placeholder="'Woord ' + (index3)" v-model="quiz.rounds[currentRound].questions[index].words['w'+(index2+1)+''+index3]" :required="true" />
                  </div>
                </div>
              </div>
            </template>
            <template v-if="currentRoundType=='gallerij'">
              <div class="field" v-for="(answer,index2) in question.answers" :key="'answer'+index+'_'+index2" >
                <div class="control mb-3">
                  <span class="mr-4 is-size-4">Foto {{ (index2+1) }}</span>
                  <BulmaButton v-if="answer.media!=''" @click="currentQuestion=answer;showMedia();mediatype='media'" icon="image" label="Toon foto" />
                  <BulmaButton v-if="answer.review!=undefined"  @click="currentQuestion=answer;showMedia();mediatype='review'" icon="image" label="Toon review foto" />
                  <BulmaButton v-if="answer.media=='' && answer.name!=''" @click="autoMedia(index,index2)" type="is-success" icon="magic" label="Genereer foto link" />
                  <BulmaButton v-if="answer.review==undefined && answer.media!=''" @click="addReviewMedia(index,index2)" type="is-success" icon="image" label="Voeg review foto toe" />
                  <BulmaButton v-if="answer.review!=undefined" @click="removeReviewMedia(index,index2)" type="is-danger" icon="times" label="Verwijder review foto" />
                </div>
                <div class="columns">
                  <div class="column">
                    <BulmaInput :placeholder="'Antwoord ' + (index+1)" v-model="quiz.rounds[currentRound].questions[index].answers[index2].name" icon="thumbs-up" :required="true" />
                  </div>
                  <div class="column">
                    <BulmaInput placeholder="/media/gallerij/uw_foto.jpg" v-model="quiz.rounds[currentRound].questions[index].answers[index2].media" icon="image" :required="true" />
                  </div>
                  <div class="column">
                    <BulmaInput v-if="answer.review!=undefined" placeholder="/media/gallerij/uw_foto_review.jpg" v-model="quiz.rounds[currentRound].questions[index].answers[index2].review" icon="image" :required="true" />
                  </div>
                </div>
              </div>
            </template>
            <template v-if="currentRoundType=='369'">
              <div class="field">
                <BulmaInput placeholder="Antwoord" v-model="quiz.rounds[currentRound].questions[index].answer" icon="thumbs-up" :required="true" />
              </div>
              <div class="control mb-2">
                <BulmaSwitch v-model="quiz.rounds[currentRound].questions[index].do" type="is-warning" label="Doe of gok vraag" />
              </div>
              <BulmaButton type="is-success"  v-if="question.media==undefined" @click="addMedia(index)" icon="image" label="Voeg media toe" />
              <BulmaInput v-if="question.media!=undefined" placeholder="/media/369/uw_media.mp4" v-model="quiz.rounds[currentRound].questions[index].media" icon="image" :required="true" />
              <div class="control mt-3" v-if="question.media!=undefined">
                <BulmaRadio val="video" type="is-warning" v-model="quiz.rounds[currentRound].questions[index].mediatype" label="Filmpje" />
                <BulmaRadio val="image" type="is-warning" v-model="quiz.rounds[currentRound].questions[index].mediatype" label="Foto" />
                <BulmaRadio val="audio" type="is-warning" v-model="quiz.rounds[currentRound].questions[index].mediatype" label="Geluidsfragment" />
              </div>
              <div class="control mt-2" v-if="question.media!=undefined">
                <BulmaButton @click="currentQuestion=question;showMedia();mediatype='player'" label="Speel media" icon="eye" />
                <BulmaButton @click="removeMedia(index)" type="is-danger" label="Verwijder media" icon="times" />
              </div>
            </template>
            <!-- media veld -->
            <div class="field" v-if="currentRoundType=='collectiefgeheugen'">
              <BulmaInput :placeholder="'/media/'+currentRoundType+'/.mp4'" v-model="quiz.rounds[currentRound].questions[index].media" icon="film" :required="true" />
            </div>
            <!-- knoppen -->
            <div class="control mt-2" v-if="currentRoundType=='collectiefgeheugen'">
              <BulmaButton v-if="question.media=='' && question.name!=''" @click="autoFilmMedia(index)" type="is-success" icon="magic" label="Genereer film link" />
              <BulmaButton v-if="question.media!=''" @click="currentQuestion=question;showMedia();mediatype='player'" icon="film" label="Speel media" />
            </div>
            <!-- antwoorden naast elkaar -->
            <div class="columns mt-3" v-if="['collectiefgeheugen','finale','opendeur'].includes(currentRoundType)">
              <div class="column" v-for="(answer,index2) in question.answers" :key="'answer'+index+'_'+index2">
                <div class="field">
                  <BulmaInput :placeholder="'Antwoord ' + (index2+1)" v-model="quiz.rounds[currentRound].questions[index].answers[index2].name" icon="thumbs-up" :required="true" />
                </div>
              </div>
            </div>
          </div>
          <BulmaButton v-if="currentRoundType=='finale'" type="is-success" @click="addFinalQuestion()" icon="plus" label="Vraag toevoegen" />
        </div>
      </div>
      <!-- import -->
      <div v-if="isImportquiz">
        <text-reader @load="quizraw = $event"></text-reader>
        <VueCodeEditor
            v-model="quizraw"
            @init="editorInit"
            lang="yaml"
            theme="monokai"
            width="100%"
            height="600px"
            :options="{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                fontSize: 14,
                highlightActiveLine: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
                wrap:true,
                showPrintMargin: false,
                showGutter: true
            }"
          />
        <BulmaButton type="is-success" v-if="isImportquiz" @click="importQuiz()" icon="file-import" label="Importeer Quiz" />
      </div>
    </div>
  </section>
</template>
<script>
  import Vue from 'vue'
  import YAML from 'yaml'
  import VueCodeEditor from 'vue2-code-editor'
  import Helpers from './../lib/Helpers'
  import Media from './../components/Media.vue'
  import TextReader from "./../components/TextReader.vue"
  import BulmaInput from "./../components/BulmaInput.vue"
  import BulmaButton from "./../components/BulmaButton.vue"
  import BulmaSwitch from "./../components/BulmaSwitch.vue"
  import MediaPreview from './../components/MediaPreview.vue'
  import BulmaRadio from "./../components/BulmaRadio.vue"
  import download from 'downloadjs'
  export default{
    name: "Designer",
    components:{VueCodeEditor,TextReader,MediaPreview,BulmaInput,BulmaButton,BulmaSwitch,BulmaRadio},
    data(){
      return  {
        quizraw:"",
        quiz:{
          rounds: [
            {
              name: "3-6-9",
              type: "369",
              description: "Hier komen de eerste 15 vragen, wie juist  antwoordt blijft aan de beurt en elke derde vraag levert 10 seconden op.",
              questions: [
                {
                  name: "",
                  answer: ""
                },
                {
                  name: "",
                  answer: ""
                },
                {
                  name: "",
                  answer: ""
                },
                {
                  name: "",
                  answer: ""
                },
                {
                  name: "",
                  answer: ""
                },
                {
                  name: "",
                  answer: ""
                },
                {
                  name: "",
                  answer: ""
                },
                {
                  name: "",
                  answer: ""
                },
                {
                  name: "",
                  answer: ""
                },
                {
                  name: "",
                  answer: ""
                },
                {
                  name: "",
                  answer: ""
                },
                {
                  name: "",
                  answer: ""
                }
              ]
            },
            {
              name: "Opendeur",
              type: "opendeur",
              description: "De ronde waarin iedereen 1 vraag krijgt waarbij 4 kernwoorden horen die elk 20 seconden kunnen opleveren.",
              questions: [
                {
                  name: "",
                  preview: "/media/opendeur/vraag1.jpg",
                  media: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  preview: "/media/opendeur/vraag2.jpg",
                  media: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  preview: "/media/opendeur/vraag3.jpg",
                  media: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  preview: "/media/opendeur/vraag4.jpg",
                  media: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                }
              ]
            },
            {
              name: "Puzzel",
              type: "puzzel",
              description: "Er moeten 3 verbanden worden gezochten tussen de termen die je zo meteen ziet verschijnen, soms moeilijk, maar het goeie nieuws: elk juist antwoord levert 30 seconden op.",
              questions: [
                {
                  name: "Puzzel1",
                  words: {
                    w11: "",
                    w12: "",
                    w13: "",
                    w14: "",
                    w21: "",
                    w22: "",
                    w23: "",
                    w24: "",
                    w31: "",
                    w32: "",
                    w33: "",
                    w34: ""
                  },
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "Puzzel2",
                  words: {
                    w11: "",
                    w12: "",
                    w13: "",
                    w14: "",
                    w21: "",
                    w22: "",
                    w23: "",
                    w24: "",
                    w31: "",
                    w32: "",
                    w33: "",
                    w34: ""
                  },
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "Puzzel3",
                  words: {
                    w11: "",
                    w12: "",
                    w13: "",
                    w14: "",
                    w21: "",
                    w22: "",
                    w23: "",
                    w24: "",
                    w31: "",
                    w32: "",
                    w33: "",
                    w34: ""
                  },
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "Puzzel4",
                  words: {
                    w11: "",
                    w12: "",
                    w13: "",
                    w14: "",
                    w21: "",
                    w22: "",
                    w23: "",
                    w24: "",
                    w31: "",
                    w32: "",
                    w33: "",
                    w34: ""
                  },
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                }
              ]
            },
            {
              name: "Gallerij",
              type: "gallerij",
              description: "In deze ronde zien we een marathon aan foto’s voorbij flitsen en de opdracht is simpel: zeggen wie of wat je ziet. Elk juist antwoord levert 15 seconden op.",
              questions: [
                {
                  name: "Gallerij1",
                  answers: [
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    }
                  ]
                },
                {
                  name: "Gallerij2",
                  answers: [
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    }
                  ]
                },
                {
                  name: "Gallerij3",
                  answers: [
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    }
                  ]
                },
                {
                  name: "Gallerij4",
                  answers: [
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    },
                    {
                      media: "",
                      name: ""
                    }
                  ]
                }
              ]
            },
            {
              name: "Collectief Geheugen",
              type: "collectiefgeheugen",
              description: "In deze ronde krijgt iedereen een filmpje te zien waarbij telkens 150 seconden te verdienen zijn. Na deze ronde kennen we de twee finalisten.",
              questions: [
                {
                  name: "",
                  media: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  media: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  media: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  media: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                }
              ]
            },
            {
              name: "Finale",
              type: "finale",
              description: "Je moet de tijd van de andere op nul krijgen en dat doe je door goeie antwoorden te geven want per goed antwoord gaan er 20 seconden af bij de tegenstander. De vraag gaat telkens eerst naar de kandidaat met het minste seconden. Roept ie stop dan gaat de beurt naar de volgende. En we zoeken telkens vijf antwoorden of trefwoorden.",
              questions: [
                {
                  name: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                },
                {
                  name: "",
                  answers: [
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ]
                }
              ]
            }
          ]
        },
        currentRound:0,
        currentRoundType:'369',
        previewMedia:false,
        currentQuestion:undefined,
        isImportquiz:false,
        focusQuestion:-1,
        mediatype:undefined
      }
    },
    methods:{
      loadAll(){
        this.loadDslm()
      },
      loadDslm(){
        this.quiz = Helpers.loadQuiz()
        if(this.quiz==undefined){
          this.resetQuiz()
        }
      },
      move(index,direction){
        var tmp=this.quiz.rounds[this.currentRound].questions[index]
        var isEnd = (index+direction)<0 || (index+direction)==this.quiz.rounds[this.currentRound].questions.length
        if(!isEnd){
          Vue.set(this.quiz.rounds[this.currentRound].questions,index,this.quiz.rounds[this.currentRound].questions[index+direction])
          Vue.set(this.quiz.rounds[this.currentRound].questions,index+direction,tmp)
          this.focusQuestion=index+direction
        }
      },
      addFinalQuestion(index=undefined){
        var newquestion={
          name:undefined,
          answers:[
            {name:undefined},
            {name:undefined},
            {name:undefined},
            {name:undefined},
            {name:undefined}
          ]
        }
        if(index!=undefined){
          this.quiz.rounds[this.currentRound].questions.splice(index,0,newquestion)
        }else{
          this.quiz.rounds[this.currentRound].questions.push(newquestion)
        }
      },
      removeFinalQuestion(index){
        this.quiz.rounds[this.currentRound].questions.splice(index,1)
      },
      showMedia(){
        this.previewMedia=true;
      },
      addMedia(index){
        Vue.set(this.quiz.rounds[this.currentRound].questions[index],'media','/media/369/')
        Vue.set(this.quiz.rounds[this.currentRound].questions[index],'mediatype','video')
      },
      autoMedia(index,index2){
        var media="/media/gallerij/" + this.quiz.rounds[this.currentRound].questions[index].name.replaceAll(" ","_")
        media+="/" + this.quiz.rounds[this.currentRound].questions[index].answers[index2].name.replaceAll(" ","_")
        media+=".jpg"
        Vue.set(this.quiz.rounds[this.currentRound].questions[index].answers[index2],'media',media)
      },
      autoFilmMedia(index){
        var media="/media/collectiefgeheugen/" + this.quiz.rounds[this.currentRound].questions[index].name.replaceAll(" ","_")
        media+=".mp4"
        Vue.set(this.quiz.rounds[this.currentRound].questions[index],'media',media)
      },
      autoAddMedia(index){
        var preview=this.quiz.rounds[this.currentRound].questions[index].preview
        var filename
        var media=this.quiz.rounds[this.currentRound].questions[index].media
        if(preview && media==""){
          try{
            filename=preview.split('.').slice(0, -1).join('.')
          }catch(e){
            //
          }
          if(filename){
            this.quiz.rounds[this.currentRound].questions[index].media=filename + ".mp4"
          }
        }
      },

      addReviewMedia(index,index2){
        var media=this.quiz.rounds[this.currentRound].questions[index].answers[index2].media
        var filename
        var extension
        var reviewfile=''
        if(media){
          try{
            filename=media.split('.').slice(0, -1).join('.')
            extension=media.split('.').pop()
          }catch(e){
            //
          }
          if(filename && extension){
            reviewfile=filename + "_review." + extension
          }
        }
        Vue.set(this.quiz.rounds[this.currentRound].questions[index].answers[index2],'review',reviewfile)
      },
      removeReviewMedia(index,index2){
        Vue.set(this.quiz.rounds[this.currentRound].questions[index].answers[index2],'review')
      },
      removeMedia(index){
        Vue.delete(this.quiz.rounds[this.currentRound].questions[index],'media')
        Vue.delete(this.quiz.rounds[this.currentRound].questions[index],'mediatype')
      },
      importQuiz(){
        var quiz
        try{
          quiz=YAML.parse(this.quizraw)
        }catch(e){
          this.$toast.error("Fout in het parsen van de quiz")
          return false
        }
        var validation = Helpers.validateQuiz(quiz)
        if(validation!=""){
          this.$toast.error(validation)
        }else{
          this.quiz=quiz;
          this.isImportquiz=false
          this.$toast.success("Quiz is geimporteerd")
        }
      },
      exportQuiz(){
        download("data:text/plain,"+encodeURIComponent(YAML.stringify(this.quiz)), "quiz.yaml", "text/plain");
      },
      resetQuiz(){
        Object.assign(this.$data, this.$options.data());
      },
      saveQuiz() {
       var validation = Helpers.validateQuiz(this.quiz)
       if(validation!=""){
         this.$toast.error(validation)
       }else{
         if(Helpers.saveQuiz(this.quiz)){
           this.$toast.success("Quiz opgeslagen in browser")
           this.loadAll()
         }else{
           this.$toast.error("Fout bij opslaan in browser")
         }
       }
      },
      editorInit: function () {
          // vue2-code-editor/node_modules/
          require('brace/ext/language_tools') //language extension prerequsite...
          require('brace/mode/yaml')
          require('brace/theme/monokai')
      }
    },
    mounted() { // when the Vue app is booted up, this is run automatically.
        this.loadAll();
    }
  }
</script>
<style scoped>
  .cursor-progress{
    cursor:progress;
  }
  label.question{font-size:2rem!important;}

</style>

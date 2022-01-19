<template>
  <div class="modal is-active" ref="modal" tabindex="0" @keydown.esc="$emit('close')">
    <div class="modal-background"></div>
    <div class="modal-content">
      <Media v-if="currentQuestion && type=='player'" :question="currentQuestion" />
      <figure class="image" v-if="currentQuestion && type=='media'">
        <img :src="currentQuestion.media" />
      </figure>
      <figure class="image" v-if="currentQuestion && type=='review'">
        <img :src="currentQuestion.review" />
      </figure>
      <figure class="image" v-if="currentQuestion && type=='preview'">
        <img :src="currentQuestion.preview" />
      </figure>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="$emit('close')"></button>
  </div>
</template>

<script>
import Media from './Media.vue'
export default {
  components: {
    Media
  },
  name: "MediaPreview",
  props:{
    type:{type:String},
    currentQuestion:{type:Object}
  },
  mounted(){
    this.$refs.modal.focus()
  },
  methods: {
  }
};
</script>

<style>
  figure img{
    max-height:60vh;
    object-fit: contain;
  }
</style>

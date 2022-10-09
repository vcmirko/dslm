<template>
  <div class="has-text-centered" v-if="question.media">
    <figure class="image" v-if="question.mediatype=='image'">
      <img :src="question.media" />
    </figure>
    <Videoplayer v-if="['video','audio'].includes((question.mediatype||'video'))" :question="question"></Videoplayer>
  </div>
</template>

<script>
  import Videoplayer from './Videoplayer.vue'

export default {
  components: {
    Videoplayer
  },
  name: "Media",
  props:{
    question:{type:Object,required:true}
  },
  mounted(){
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

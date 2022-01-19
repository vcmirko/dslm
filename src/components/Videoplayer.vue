<template>
  <div class="has-text-centered">
    <Media
      :kind="(question.mediatype||'video')"
      :isMuted="(false)"
      :src="[question.media]"
      :autoplay="true"
      :controls="true"
      :loop="false"
      :ref="'video_player'"
      height="auto"
    ></Media>
    <div class="has-text-centered">
      <button class="button is-medium is-success" @click="$refs.video_player.play()"><span class="icon"><font-awesome-icon icon="play" /></span><span>Play</span></button>
    </div>
  </div>
</template>

<script>
import Media from "@dongido/vue-viaudio";

export default {
  components: {
    Media
  },
  name: "Videoplayer",
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
</style>

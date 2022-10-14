<template>
    <font-awesome-icon icon="bullseye" :class="{'has-text-info':!dragging,'has-text-primary':dragging}" @drop.prevent="dropHandler" @dragover.prevent="dragging=true" @dragleave="dragging=false" />
</template>

<script>

export default {
  components: {
  },
  name: "DragTarget",
  props:['index'],
  data(){
    return{
      dragging:false
    }
  },
  mounted(){
  },
  methods: {
    dropHandler(e){
      this.dragging=false
      var files=[]
      e.preventDefault()
      const dt = e.dataTransfer
      if(dt){
        if(dt.files){
          Object.keys(dt.files).forEach((k) => {
            files.push(dt.files[k].name)
          })
          this.$emit('import',{files:files,index:this.index})
        }
      }
    }
  }
};
</script>

<style>
</style>

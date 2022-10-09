<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
  export default{
    components:{},
    name:"DeSlimsteMens",
    data(){
      return{
      }
    },
    computed: {
    },
    beforeMount() {
    },
    methods: {
    },
    loaded(){
      this.$router.push({name:"Home"}).catch(err => {});
    }
  }
</script>
<style scoped>
#app{
  height:100%;
}
</style>

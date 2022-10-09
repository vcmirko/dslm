<template>
    <button v-if="!iconOnly" class="button mr-2" :class="type" @click="click">
      <span class="icon is-small mr-2 is-left"><font-awesome-icon :icon="icon" /></span>
      <span v-if="label!=''">{{ label }}</span>
    </button>
    <span v-else class="icon is-size-5 is-left is-clickable" @click="click" :class="type"><font-awesome-icon :icon="icon" /></span>
</template>
<script>
  import Vue from 'vue'
  export default{
    name:"BulmaButton",
    props:{
      type:{type:String,default:'is-info'},
      icon:{type:String,default:'fa-user'},
      label:{type:String,default:''},
      iconOnly:{type:Boolean,default:false}
    },
    data(){
      return  {
      }
    },methods:{
      click(event){
        this.$emit('click',event)
      }
    }
  }
</script>

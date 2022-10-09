<template>
  <span>
      <input type="radio" :id="_uid" class="is-checkradio" :class="type" :value="val" v-model="checked">
      <label :for="_uid"> {{ label }}</label>
  </span>
</template>
<script>
  import Vue from 'vue'
  import BulmaCheckRadio from "bulma-checkradio"
  import "../../public/assets/bulma_checkradio.scss"
  export default{
    name:"BulmaRadio",
    props: ['type','value', 'val','label'],
    data () {
      return {
      }
    },
    computed: {
      checked: {
        get() {
          return this.value
        },
        set(value) {
          this.$emit('input', value)
        }
      }
    }
  }
</script>

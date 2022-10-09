<template>
  <span>
      <input type="checkbox" :id="_uid" class="switch is-rounded" :class="type" :value="val" v-model="checked">
      <label :for="_uid"> {{ label }}</label>
  </span>
</template>
<script>
  import Vue from 'vue'
  import BulmaSwitch from "bulma-switch"
  import "../../public/assets/bulma_switch.scss"
  export default{
    name:"BulmaSwitch",
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

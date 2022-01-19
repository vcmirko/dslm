<template>
  <div class="control has-icons-left">
    <input
      class="input"
      @keyup.enter="$emit('enterClicked')"
      :readonly="readonly"
      v-focus="focus"
      :type="type"
      tabindex="0"
      :id="_uid"
      :value="value"
      :class="{'is-danger':hasError||(required && ! value)||(required&&value&&value.length==0)}"
      @input="$emit('input', $event.target.value)"
      @blur="$emit('blur', $event.target.value)"
      :placeholder="placeholder">
    <span class="icon is-left">
      <font-awesome-icon :icon="icon" />
    </span>
  </div>
</template>
<script>

  import Vue from 'vue'
  Vue.directive('focus', {
    // When the bound element is inserted into the DOM...
    inserted: function (el,binding) {
      // Focus the element
      if(binding.value=="true"){
        el.focus()
      }
    }
  })
  export default{
    name:"BulmaInput",
    props:{
      focus:{type:String,default:""},
      value:{type:[String,Number],default:""},
      type:{type:String,default:"text"},
      readonly:{type:Boolean,default:false},
      required:{type:Boolean,default:false},
      placeholder:{type:String,default:""},
      icon:{type:String,default:''},
      label:{type:String,default:""},
      hasError:{type:Boolean,default:false}
    },data(){
      return{
      }
    }
  }
</script>
<style scoped>
</style>

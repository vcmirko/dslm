<template>
  <span>
    <div class="field">
      <div class="control has-icons-left">
        <div class="input">
          <div class="tags">
            <span v-for="t,i in tags" :key="t" class="tag is-success">
              {{ t }}
              <button class="delete is-small" @click="remove(i)"></button>
            </span>
            <span class="tag dropdown is-active">
              <div class="dropdown-trigger">
                <input tabindex="0" v-model="tag" @keydown.esc.prevent="reset" @keydown.tab.prevent="add" @keydown.down="focus(1)" @keydown.up="focus(-1)" @keydown.enter="select" />
              </div>
              <div class="dropdown-menu" id="dropdown-menu" v-if="autoCompleteFilter.length>0" role="menu">
                <div class="dropdown-content">
                  <a href="#" v-for="a,i in autoCompleteFilter" :key="a" @click="tag=a;update()" class="dropdown-item" :class="{'is-active':i==itemFocus}">
                    {{ a }}
                  </a>
                </div>
              </div>
            </span>

          </div>
        </div>
        <span class="icon is-left"><font-awesome-icon icon="tags" /></span>
      </div>
    </div>
  </span>
</template>
<script>
  import Vue from 'vue'
  export default{
    name:"BulmaTags",
    props: ['value','autoComplete'],
    data () {
      return {
        tags:[],
        tag:"",
        itemFocus:undefined,
        forceDrop:false
      }
    },
    watch: {
      value: function (val) {
        if(val) this.tags=val.split(',')
      }
    },
    computed: {
      autoCompleteFilter(){
        return (this.autoComplete || []).filter(x => ((this.tag && x.includes(this.tag))||(this.forceDrop && !this.tag)) && !this.tags.includes(x))
      },
      exists(){
        return this.tags.some(x => x==this.tag)
      }
    },
    methods:{
      focus(direction){
        this.forceDrop=true
        const l = this.autoCompleteFilter.length
        if(l>0){
          if(this.itemFocus==undefined){
            this.itemFocus=-1
          }
          if(this.itemFocus<l && direction>0){
            this.itemFocus++
          }
          if(this.itemFocus>0 && direction<0){
            this.itemFocus--
          }
        }
      },
      select(e){
        if(this.itemFocus!=undefined){
          this.tag=this.autoCompleteFilter[this.itemFocus]
          this.add(e)
          this.itemFocus=undefined;
          this.forceDrop=false;
        }
      },
      remove(i){
        this.tags.splice(i,1);
        this.update();
      },
      add(e){
        if(!this.exists && this.tag){
          this.tags.push(this.tag)
        }else if(!this.tag){
          this.$emit('keydown', { keyCode: 9 })
        }else{
          this.$toast.warning("Tag bestaat al")
        }
        this.reset();
        this.update();
      },
      reset(){
        this.tag=""
        this.forceDrop=false
        this.itemFocus=undefined
      },
      update(event){
        this.$emit('input', this.tags.join(","));
      }
    },
    mounted(){
    }
  }
</script>
<style scoped>
  input{

  }
</style>

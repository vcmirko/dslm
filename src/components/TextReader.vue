<template>
  <div class="file mb-2 is-link">
    <label class="file-label">
      <input class="file-input" ref="importbutton" type="file" @change="loadTextFromFile">
      <span class="file-cta">
        <span class="file-icon">
          <font-awesome-icon icon="upload" />
        </span>
        <span class="file-label">
          {{ label }}
        </span>
      </span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    label:{
      type:String,
      required: true
    }
  },
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = e => this.$emit("load", e.target.result);
      reader.readAsText(file);
      this.$refs.importbutton.value=null
    }
  }
};
</script>

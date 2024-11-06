<template>
  <div class="p-20">
    <QuillEditor v-model="content" />
  </div>
</template>

<script>
import QuillEditor from '@/components/quill-editor/index.v1.vue'
export default {
  components: {
    QuillEditor
  },
  data () {
    return {
      content: ''
    }
  },
  created () {
    setTimeout(() => {
      this.content = `
        <h1>I am snow example! </h1><p><span class="ql-size-large">We Can a man still be brave if he's afraid? That is the only time a man can be brave. </span></p><p><strong>Courage and folly is </strong><strong style="color: rgb(230, 0, 0);">always</strong><strong> just a fine line.</strong></p>
      `
    }, 800)
  }
}
</script>

<style lang="less" scoped>

</style>

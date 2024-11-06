<template>
  <div>
    <div :id="'toolbar' + uuid" class="toolbar-con">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>

      <button class="ql-blockquote"></button>
      <button class="ql-code-block"></button>

      <button class="ql-link"></button>
      <button class="ql-image"></button>
      <button class="ql-video"></button>
      <button class="ql-formula"></button>

      <button class="ql-header" value="1"></button>
      <button class="ql-header" value="2"></button>

      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-list" value="check"></button>

      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>

      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>

      <button class="ql-direction"></button>

      <select class="ql-size">
        <option value="false">
          Normal
        </option>
        <option
          v-for="(item, index) in sizeList"
          :key="index"
          :value="item"
        >
          {{ item }}
        </option>
      </select>
      <select class="ql-header"></select>
      <select class="ql-color"></select>
      <select class="ql-background"></select>
      <select class="ql-font"></select>
      <select class="ql-align"></select>
      <button class="ql-clean"></button>
      <button class="ql-custom-button" style="width: auto" @click="onCustomButtonClick">
        [ Click me ]
      </button>
    </div>
    <div ref="editorRef" class="editor-con" :style="editorStyle"></div>
  </div>
</template>

<script>
import { Quill } from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import { genGuid } from '@/utils'

const sizeList = ['12', '14', '16', '18', '20', '24', '28'].map(item => item + 'px')
// font-size
const Size = Quill.import('attributors/style/size')
Size.whitelist = sizeList
Quill.register(Size, true)

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 200
    },
    minHeight: {
      type: Number,
      default: null
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const uuid = genGuid()
    return {
      uuid,
      sizeList,
      currentValue: '',
      editorOptions: {
        theme: 'snow',
        bounds: document.body,
        debug: 'warn',
        modules: {
          toolbar: '#toolbar' + uuid
          // toolbar: [
          //   ['bold', 'italic', 'underline', 'strike'],
          //   ['blockquote', 'code-block'],
          //   ['link', 'image', 'video', 'formula'],
          //   [{ header: 1 }, { header: 2 }],
          //   [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
          //   [{ script: 'sub' }, { script: 'super' }],
          //   [{ indent: '-1' }, { indent: '+1' }],
          //   [{ direction: 'rtl' }],

          //   [{ size: sizeList }],
          //   [{ header: [1, 2, 3, 4, 5, 6, false] }],

          //   [{ color: [] }, { background: [] }],
          //   [{ font: [] }],
          //   [{ align: [] }],

          //   ['clean'],
          //   ['custom-button']
          // ]
        },
        placeholder: this.placeholder,
        readOnly: this.readonly
      }
    }
  },
  computed: {
    editorStyle () {
      const style = {}
      if (this.minHeight) {
        style.minHeight = this.minHeight + 'px'
      }
      if (this.height) {
        style.height = this.height + 'px'
      }
      return style
    }
  },
  watch: {
    value: {
      handler (newVal) {
        if (this.currentValue !== newVal) {
          this.currentValue = newVal || ''
          if (this.quillInstance) {
            this.quillInstance.pasteHTML(this.currentValue)
          }
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.quillInstance = null
    this.init()
  },
  beforeDestroy () {
    this.quillInstance = null
  },
  methods: {
    init () {
      const ins = new Quill(this.$refs.editorRef, this.editorOptions)
      this.quillInstance = ins
      ins.pasteHTML(this.currentValue)
      console.log('ins: ', ins)
      ins.on('text-change', (delta, oldDelta, source) => {
        const html = this.$refs.editorRef.children[0].innerHTML
        const text = ins.getText()
        this.currentValue = html
        this.$emit('input', html)
        this.$emit('change', { html, text, quill: ins })
      })
      const toolbar = ins.getModule('toolbar')
      toolbar.addHandler('image', val => {
        if (val) {
          const index = ins.getSelection().index
          ins.insertEmbed(index, 'image', 'https://onlinecoding-1257413033.cos.ap-guangzhou.myqcloud.com/zhao/ezhaopin_8254c365-fecf-4526-92d4-36cabf5b55c1.png')
          ins.setSelection(index + 1)
        } else {
          ins.format('image', false)
        }
      })
    },
    onCustomButtonClick () {
      console.log('onCustomButtonClick: ')
    }
  }
}
</script>

<style lang="less" scoped>

</style>

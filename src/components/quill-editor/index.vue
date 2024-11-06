<template>
  <div>
    <VueQuillEditor
      ref="editorRef"
      v-model="content"
      class="editor"
      :options="editorOption"
      @blur="onEditorBlur"
      @focus="onEditorFocus"
      @ready="onEditorReady"
    >
      <div :id="'toolbar-' + uuid" slot="toolbar">
        <!-- Add a bold button -->
        <button class="ql-image">
          Image
        </button>
        <button class="ql-bold">
          Bold
        </button>
        <button class="ql-italic">
          Italic
        </button>
        <select class="ql-size" @change="onSizeChange">
          <option
            v-for="(item, index) in sizeList"
            :key="index"
            :value="item"
          >
            {{ item }}
          </option>
        </select>
        <select class="ql-lineheight" @change="onLineHeightChange">
          Lineheight
        </select>
        <select class="ql-color">
          Color
        </select>
        <select class="ql-background">
          Background
        </select>
        <!-- You can also add your own -->
        <button class="ql-custom-button" style="width: 100px;" @click="customButtonClick">
          [ Click me ]
        </button>
      </div>
    </VueQuillEditor>
  </div>
</template>

<script>
import { quillEditor, Quill } from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import { genGuid } from '@/utils'

const sizeList = ['12', '14', '16', '18', '20', '24', '28'].map(item => item + 'px')
const lineHeightList = ['18', '20', '22', '24', '28', '32', '36'].map(item => item + 'px')
// music-file.y.qq.com/songlist/u/oi4ANKnk7eEqoz/a61e/de4c39c32b624cbd6c01fa92a0f8baaf699fa3fc_28f629.jpg?imageView2/4/w/300/h/300
// font-size
const Size = Quill.import('attributors/style/size')
Size.whitelist = sizeList
Quill.register(Size, true)
// line-height
const Parchment = Quill.import('parchment')
class Font extends Parchment.Attributor.Class {}
const lineHeight = new Font('lineHeight', 'ql-lineheight', {
  scope: Parchment.Scope.INLINE,
  whitelist: lineHeightList
})
Quill.register({
  'formats/line-height': lineHeight
})
// font-family
const FontFamily = Quill.import('formats/font')
FontFamily.whitelist = ['Helvetica', 'Arial', 'sans-serif', 'Simsun', 'Consolas', 'monospace']

Quill.register(FontFamily, true)
export default {
  components: {
    VueQuillEditor: quillEditor
  },
  data () {
    const uuid = genGuid()
    return {
      uuid,
      sizeList,
      lineHeightList,
      editorOption: {
        theme: 'bubble',
        modules: {
          toolbar: '#toolbar-' + uuid
        }
      },
      content: '<h1 class="ql-align-center"><span class="ql-font-serif">Custom toolbar example!</span></h1><p><br></p><p><strong class="ql-font-serif">Whenever you play the game of thrones, you either win or die. There is no middle ground.</strong></p><p><br></p><p><u class="ql-font-serif">Some war against sword and spear to win, and the others the crow and the paper to win.</u></p><p><br></p><p><em class="ql-font-serif">Dead history is write in ink, the living sort in blood.</em></p><p><br></p><p><strong style="color: rgb(0, 102, 204);">Blog site: </strong><a href="https://surmon.me/" rel="noopener noreferrer" target="_blank" style="background-color: rgb(255, 255, 255);"><strong>https://surmon.me</strong></a></p><p><br></p><p><span class="ql-font-serif" style="color: rgb(0, 102, 204);">They\'re only numbers. Numbers on paper. Once you understand that, it\'s easy to make them behave.</span></p><p><br></p><p><strong class="ql-font-monospace">When the snows fall and the white winds blow, the lone wolf dies, but the pack survives.</strong></p>'
    }
  },
  computed: {
    editorInstance () {
      return this.$refs.editorRef.quill
    }
  },
  methods: {
    onEditorBlur (editor) {
      // console.log('editor blur!', editor)
    },
    onEditorFocus (editor) {
      // console.log('editor focus!', editor)
    },
    onEditorReady (editor) {
      // console.log('editor ready!', editor)
    },
    customButtonClick () {
      console.log('You can custom the button and listen click event to do something...')
    },
    onSizeChange (event) {
      this.editorInstance.format('size', event.target.value)
      setTimeout(() => {
        console.log(this.editorInstance.editor.delta)
      }, 1000)
    },
    onLineHeightChange (event) {
      this.editorInstance.format('line-height', event.target.value)
      setTimeout(() => {
        console.log(this.editorInstance.editor.delta)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>

</style>

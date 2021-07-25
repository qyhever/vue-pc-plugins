import Vue from 'vue'
import Main from './main.vue'
const PromptConstructor = Vue.extend(Main)

function prompt (options) {
  const instance = new PromptConstructor({
    data: options || {}
  })
  instance.visible = true
  instance.$mount()
  document.body.appendChild(instance.$el)
}

export default prompt

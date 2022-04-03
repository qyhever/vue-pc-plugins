import Vue from 'vue'
import Main from './image-viewer'
import { isObject } from '@/utils/type'
const ViewerConstructor = Vue.extend(Main)

export default function (opt) {
  if (!opt) {
    return
  }
  let urlList = []
  let options = {}
  if (typeof opt === 'string') {
    urlList = [opt]
  }
  if (Array.isArray(opt)) {
    urlList = opt
  }
  if (isObject(opt)) {
    options = opt
    urlList = opt.urlList
  }
  const instance = new ViewerConstructor({
    data: {
      ...options,
      urlList
    }
  })
  instance.visible = true
  instance.$mount()
  document.body.appendChild(instance.$el)
}

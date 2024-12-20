import { isBlob } from '@/utils/type'

export function findParentNode (list, cb, parent = null) {
  for (const node of list) {
    if (cb(node)) return parent
    const res = findParentNode(node.children || [], cb, node)
    if (res) return res
  }
  return null
}
// findParentNode(arr, v => v.id === 2)

// toFixed 修复版： 修复 1.335.toFixed(2) => 1.33
export function toFixed (val, s = 2) {
  const num = val || 0
  if (/^\d+$/.test(String(num))) { // 整数
    return num.toFixed(s)
  }
  const times = Math.pow(10, s)
  let des = num * times + 0.5
  des = parseInt(des, 10) / times
  return des + ''
}

export function genGuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const downloadFile = (function () {
  if (navigator.msSaveOrOpenBlob) {
    return function (file, name) {
      window.navigator.msSaveOrOpenBlob(file, name)
    }
  }
  return function (file, name) {
    const url = window.URL.createObjectURL(file)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', name)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }
})()

export function getFileNameByContentDisposition (cd) {
  // return (decodeURIComponent(cd).split('filename=')[1] || '').replace(/"|'/g, '')
  const result = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(decodeURIComponent(cd))
  if (result && result[0]) {
    return decodeURIComponent(result[0]).replace('filename=', '').replace(/"|'/g, '')
  }
  return ''
}

// 下载模板文件（接受一个Promise格式的api请求，要求返回源数据response，因为要读取headers里面的文件名）
export function downloadFileByApi (api) {
  return api().then(res => {
    const blob = res.data
    const fileName = getFileNameByContentDisposition(res.headers['content-disposition']) || genGuid()
    if (!blob || !isBlob(blob) || blob.type === 'application/json') {
      return [true] // fail
    }
    downloadFile(blob, fileName)
    return [null] // success
  }).catch(err => {
    console.log('err: ', err)
    return [err] // fail
  })
}


/**
 * 扁平数组 转 树状结构
 * @param {Array} list 源数组
 * @param {String|Number|null} id 父级ID值
 * @param {String} key 子级ID键
 * @param {String} parentKey 父级ID键
 * @return {Array} 树状数据 ep: listToTree([], null, 'id', 'parentId')
 */
export function listToTree (list, id, key, parentKey) {
  const ret = []
  const temp = list.filter(v => v[parentKey] === id)
  temp.forEach(item => {
    ret.push({
      ...item,
      children: listToTree(list, item[key], key, parentKey)
    })
  })
  return ret
}

/**
 * 通过一个字段来分组
 * @param {Array} data 源数组
 * @param {String} options.groupKey 分组字段键
 * @param {String} options.childKey 嵌套数组键
 * @param {Function} options.genItemCb 生成分组下面的数组项
 * @return {Array} 分组后的数组 ep: groupFlatList([], 'nodeCode', item => ({...item, _id: genGuid()}))
 */
export function groupFlatList (data, options) {
  const {
    groupKey = 'groupKey',
    childKey = 'child',
    genItemCb = item => item
  } = options
  const ret = []
  data.forEach(item => {
    const findItem = ret.find(v => v[groupKey] === item[groupKey])
    if (!findItem) {
      ret.push({
        ...item,
        [childKey]: [genItemCb(item)]
      })
    } else {
      findItem[childKey].push(genItemCb(item))
    }
  })
  return ret
}

export function flattenGroupedList (data, childrenKey = 'child') {
  const ret = []
  data.forEach(item => {
    item[childrenKey].forEach(v => {
      ret.push(v)
    })
  })
  return ret
}

/**
 * 下载文件
 * @param {Blob|File} file 文件流
 * @param {String} name 文件名
 */
export const downloadFile = (function () {
  if (navigator.msSaveOrOpenBlob) {
    return function (file, name) {
      window.navigator.msSaveOrOpenBlob(file, name)
    }
  }
  return function (file, name, type) {
    const url = window.URL.createObjectURL(file, {
      type: file.type || type
    })
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

/**
 * 预览文件
 * @param {Blob|File} file 文件流
 * @param {String} name 文件名
 */
export function previewFile (file) {
  const url = window.URL.createObjectURL(file, {
    type: file.type
  })
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('target', '_blank')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export function getFileNameByContentDisposition (contentDisposition) {
  let fileName = ''
  if (contentDisposition) {
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
    if (matches && matches[1]) {
      fileName = matches[1].replace(/['"]/g, '')
    }
  }
  return decodeURIComponent(fileName)
}

/**
 * 匹配 img 标签，加上 max-width: 100%
 * @param {String} html html字符串
 * @return {String} 处理后的字符串
 */
export function matchImgAddResize (html) {
  let content = html || ''
  const pattern = /<img [^>]*src=['"]([^'"]+)[^>]*>/g
  const matchList = content.match(pattern) || []
  const resultList = []
  matchList.forEach(item => {
    const r = /style=".*"/
    if (r.test(item)) {
      // 存在 style
      // 存在 style="max-width: 100%"
      if (/max-width:\s?100%/.test(item)) {
        resultList.push(item)
      } else {
        resultList.push(item.replace(r, ' style="max-width: 100%"'))
      }
    } else {
      resultList.push(item.replace(/\/?>$/, '') + ' style="max-width: 100%" />')
    }
  })
  matchList.forEach((item, index) => {
    content = content.replace(item, resultList[index])
  })
  return content
}

/**
 * 对 html 字符串 进行反向转义
 * @param {String} html html字符串
 * @return {String} 处理后的字符串
 */
export function unEscapeHtml (html) {
  if (typeof html !== 'string') {
    return ''
  }
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<script>/g, '&lt;script&gt;')
    .replace(/<\/script>/g, '&lt;/script&gt;')
}

/**
 * 生成随机字符串
 * @return {String} 随机字符串
 */
export function getRandomStr () {
  return new Date().getTime() + Math.random().toString(16).slice(2)
}

function s4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

export function genGuid () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

/**
 * 打开文件选择框
 * @return {Promise<File>} Promise 文件流
 */
export function createFileInput () {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.onchange = e => {
      const file = e.target.files[0]
      resolve(file)
    }
    input.click()
    input.remove()
  })
}
/**
 * 阿拉伯数字转中文数字
 * @param {Number} num 阿拉伯数字
 * @return {String} 中文数字
 */
export function arabicNumToCnNum (num) {
  if (num === 10) {
    return '十'
  }
  const changeNum = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const unit = ['', '十', '百', '千', '万']
  const getCh = temp => {
    const strArr = temp.toString().split('').reverse()
    let newNum = ''
    for (let i = 0; i < strArr.length; i++) {
      newNum = (i === 0 && strArr[i] === 0 ? '' : (i > 0 && strArr[i] === 0 && strArr[i - 1] === 0 ? '' : changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i]))) + newNum
    }
    return newNum
  }
  const ny = Math.floor(num / 100000000)
  num = ny ? (num - ny * 100000000) : num
  const nw = Math.floor(num / 10000)
  num = nw ? (num - nw * 10000) : num
  return ny ? getCh(ny) + '亿' + getCh(nw) + '万' + getCh(num) : nw ? getCh(nw) + '万' + getCh(num) : getCh(num)
}

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

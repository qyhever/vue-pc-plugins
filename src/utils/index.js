function findParentNode(list, cb, parent = null) {
  for(const node of list) {
    if(cb(node)) return parent
    const res = findParentNode(node.children || [], cb, node)
    if(res) return res
  }
  return null
}
// findParentNode(arr, v => v.id === 2)

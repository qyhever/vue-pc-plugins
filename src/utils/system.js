// 判断移动端设备
export function isMobile () {
  const mobiles = ['Android', 'webOS', 'iPhone', 'SymbianOS', 'Windows Phone', 'IEMobile', 'iPad', 'BlackBerry', 'Opera Mini', 'Mobile', 'XiaoMi']
  // 判断是否存在 window.orientation，此属性在移动设备上一般存在
  if (typeof window.orientation !== 'undefined') {
    return true
  }
  let ret = false
  const userAgentInfo = window.navigator.userAgent
  for (let i = 0; i < mobiles.length; i++) {
    if (userAgentInfo.indexOf(mobiles[i]) >= 0) {
      ret = true
      break
    }
  }
  return ret
}

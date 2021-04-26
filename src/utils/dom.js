/**
 * 让任意元素滚动到指定位置
 * @param  {HTMLElement} el     [元素]
 * @param  {Number} from        [开始位置]
 * @param  {Number} to          [结束位置]
 * @param  {Number} duration    使用时间
 * @param  {Function} endCallback 完成后回调
 * @example scrollTo(window, window.pageYOffset, 0, 1000)
 */ 
 export function scrollTo(el, from = 0, to, duration = 500, endCallback) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / duration * 50)

  function scroll(start, end, step) {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = (start + step > end) ? end : start + step
    if (start > end) {
      d = (start - step < end) ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

/**
 * 获取当前 scrollTop
 * @return {String} scrollTop
 */
 export function getScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
}

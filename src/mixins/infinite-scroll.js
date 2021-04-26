import { throttle } from 'lodash'
import { isFunc } from '@/utils/type'
import { getScrollTop } from '@/utils/dom'

/**
 * <p v-show="tableData.length && isTotalLoaded && currentScrollTop">没有更多数据了！</p>
   <p v-show="tableData.length && isReachBottom">拼命加载中...</p>
 */

export default {
  data() {
    return {
      pager: {
        currentPage: 1,
        pageSize: 10
      },
      lockScroll: false, // 数据加载中
      isReachBottom: false, // 用来控制频繁在 触底区域内 滚动，只触发一次 请求
      reachBottomDistance: 100, // 触底距离
      isTotalLoaded: false, // 是否加载完全部数据
      lastScrollTop: 0, // 上一次 scrollTop
      currentScrollTop: 0 // 用来做 没有更多数据 的显示判断，如果数据不满一屏，显示 没有更多数据 不太好
    }
  },
  mounted() {
    if (!isFunc(this.query)) {
      throw new Error('Please declare the query method')
    }
    const _onScroll = throttle(this.onScroll, 50)
    window.addEventListener('scroll', _onScroll)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('scroll', _onScroll)
    })
  },
  methods: {
    onScroll() {
      this.currentScrollTop = getScrollTop()
      // 加载中
      if (this.lockScroll) {
        return
      }
      // 数据全部加载完成
      if (this.isTotalLoaded) {
        return
      }
      const viewH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
      const contentH = document.documentElement.scrollHeight || document.body.scrollHeight
      const scrollT = this.lastScrollTop = getScrollTop()
      const currentH = viewH + scrollT + this.reachBottomDistance

      // console.log('viewH', viewH)
      // console.log('contentH', contentH)
      // console.log('scrollT', scrollT)

      // 在 distance 区域外区域滚动，重置 isReachBottom
      if (currentH < contentH && this.isReachBottom) {
        this.isReachBottom = false
      }
      // 在 distance 区域内触发 onReachBottom 后，不再触发
      if (this.isReachBottom) {
        return
      }
      if (contentH <= currentH) {
        this.onReachBottom()
      }
    },
    onReachBottom() {
      console.log('onReachBottom')
      this.lockScroll = true
      this.isReachBottom = true
      this.pager.currentPage += 1
      this.query()
    },
    // 在表单控件变化时调用
    changeQuery() {
      this.pager.currentPage = 1
      this.isTotalLoaded = false
      this.query()
    },
    // 通过总数据条数结束
    endBySize(totalSize) {
      this.isTotalLoaded = this.pager.currentPage * this.pager.pageSize >= totalSize
      this.endScroll()
    },
    // 通过总页数结束
    endByPage(totalPage) {
      this.isTotalLoaded = this.pager.currentPage === totalPage
      this.endScroll()
    },
    endByList(currentLen) {
      this.isTotalLoaded = currentLen < this.pager.pageSize
      this.endScroll()
    },
    // 自定义方式，自己知道数据全部加载完成
    endSuccess(currentLen, totalLoaded) {
      if (typeof totalLoaded !== 'undefined') {
        this.isTotalLoaded = totalLoaded
      } else {
        this.isTotalLoaded = currentLen < this.pager.pageSize
      }
      this.endScroll()
    },
    endScroll() {
      this.$nextTick(() => {
        this.lockScroll = false
        this.isReachBottom = false
        // if (this.lastScrollTop !== getScrollTop()) {
        //   window.scrollTo(0, this.scrollTop)
        //   document.documentElement.scrollTop = this.lastScrollTop
        // }
      })
    }
  }
}

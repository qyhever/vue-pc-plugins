<template>
  <div class="page-wrapper">
    <ul class="navs">
      <li
        class="nav-item"
        v-for="(item, index) in navs"
        :key="index"
        :class="{active: activeValue === item.value}"
        @click="onNavItemClick(item.value)"
      >
        {{item.label}}
      </li>
    </ul>
    <div class="recommended" ref="recommended">recommended</div>
    <div class="content" ref="content">content</div>
    <div class="about" ref="about">about</div>
  </div>
</template>

<script>
import { scrollTo, getScrollTop } from '@/utils/dom'
import { throttle, minBy } from 'lodash'
export default {
  data() {
    return {
      navs: [
        { label: '推荐', value: 'recommended' },
        { label: '主要内容', value: 'content' },
        { label: '关于', value: 'about' }
      ],
      height: 0,
      activeValue: 'recommended'
    }
  },
  mounted() {
    this.lastScrollTop = getScrollTop()
    const onScrollThrottled = throttle(this.onScroll, 200)
    window.addEventListener('scroll', onScrollThrottled)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('scroll', onScrollThrottled)
    })
  },
  methods: {
    onNavItemClick(value) {
      this.activeValue = value
      scrollTo(window, window.pageYOffset, this.$refs[value].offsetTop - 60, 800)
    },
    onScroll() {
      console.log('onScroll')
      const els = [
        {el: this.$refs.recommended, name: 'recommended'},
        {el: this.$refs.content, name: 'content'},
        {el: this.$refs.about, name: 'about'}
      ]
      const viewHeight = window.innerHeight
      const innerEls = els.filter(item => {
        const rect = item.el.getBoundingClientRect()
        return rect.top > 0 && rect.top < viewHeight
      })
      const minTopEl = minBy(innerEls, item => {
        const rect = item.el.getBoundingClientRect()
        return rect.top
      })
      if (minTopEl && this.activeValue !== minTopEl.name) {
        this.activeValue = minTopEl.name
      }
      // console.log('minTopEl', minTopEl)
      // for (let i = 0; i < els.length; i++) {
      //   const item = els[i]
      //   const rect = item.el.getBoundingClientRect()
      //   if (rect.top > 0 && rect.top < viewHeight) {
      //     if (this.activeValue !== item.name) {
      //       this.activeValue = item.name
      //       break
      //     }
      //   }
      // }
      // 滚动方向
      const currentScrollTop = getScrollTop()
      const delta = currentScrollTop - this.lastScrollTop
      if (delta > 0) { // 向下滚
        // console.log('向下滚')
      } else { // 向上滚
        // console.log('向上滚')
      }
      this.lastScrollTop = currentScrollTop
    }
  }
}
</script>

<style lang="scss" scoped>
  * {
    margin: 0;
    padding: 0;
  }
  .page-wrapper {
    padding-top: 60px;
  }
  .navs {
    position: fixed;
    top: 0;
    width: 100%;
    height: 60px;
    display: flex;
    background: linear-gradient(90deg,#3464e0,#1890ff);
  }
  .nav-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    color: #fff;
    cursor: pointer;
    &.active {
      font-size: 16px;
      font-weight: 700;
    }
  }
  .recommended {
    height: 1200px;
    background: skyblue;
  }
  .content {
    height: 800px;
    background: #f4f0f6;
  }
  .about {
    height: 1000px;
    background: pink;
  }
</style>

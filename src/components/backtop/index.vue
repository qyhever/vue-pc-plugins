<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="visible"
      @click.stop="handleClick"
      :style="{
        'right': styleRight,
        'bottom': styleBottom
      }"
      class="el-backtop">
      <slot>
        <i class="el-icon-caret-top"></i>
      </slot>
    </div>
  </transition>
</template>

<script>
import 'element-ui/packages/theme-chalk/src/backtop.scss'
import { throttle } from 'lodash'

const cubic = value => Math.pow(value, 3)
const easeInOutCubic = value => value < 0.5
  ? cubic(value * 2) / 2
  : 1 - cubic((1 - value) * 2) / 2

export default {
  name: 'Backtop',

  props: {
    visibilityHeight: {
      type: Number,
      default: 200
    },
    right: {
      type: Number,
      default: 40
    },
    bottom: {
      type: Number,
      default: 60
    }
  },

  data() {
    return {
      visible: false
    }
  },

  computed: {
    styleBottom() {
      return `${this.bottom}px`
    },
    styleRight() {
      return `${this.right}px`
    }
  },

  mounted() {
    this.throttledScrollHandler = throttle(this.onScroll, 300)

    window.addEventListener('scroll', this.throttledScrollHandler)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('scroll', this.throttledScrollHandler)
    })
  },

  methods: {
    onScroll() {
      this.visible = window.pageYOffset >= this.visibilityHeight
    },
    handleClick(e) {
      this.scrollToTop()
      this.$emit('click', e)
    },
    scrollToTop() {
      const beginTime = Date.now()
      const beginValue = window.pageYOffset
      const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16))
      const frameFunc = () => {
        const progress = (Date.now() - beginTime) / 500
        if (progress < 1) {
          window.scrollTo(0, beginValue * (1 - easeInOutCubic(progress)))
          rAF(frameFunc)
        } else {
          window.scrollTo(0, 0)
        }
      }
      rAF(frameFunc)
    }
  }
}
</script>

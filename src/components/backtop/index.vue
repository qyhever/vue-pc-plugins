<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="visible"
      :style="{
        'right': styleRight,
        'bottom': styleBottom
      }"
      class="el-backtop"
      @click.stop="handleClick"
    >
      <slot>
        <i class="el-icon-caret-top" />
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
    },
    target: {
      type: Function,
      default: null
    }
  },

  data () {
    return {
      visible: false,
      el: null
    }
  },

  computed: {
    styleBottom () {
      return `${this.bottom}px`
    },
    styleRight () {
      return `${this.right}px`
    }
  },

  mounted () {
    this.el = document.documentElement
    if (this.target) {
      this.el = this.target()
      if (!this.el) {
        throw new Error(`target is not existed: ${this.target}`)
      }
    }
    this.throttledScrollHandler = throttle(this.onScroll, 300)

    this.el.addEventListener('scroll', this.throttledScrollHandler)
    this.$once('hook:beforeDestroy', () => {
      this.el.removeEventListener('scroll', this.throttledScrollHandler)
    })
  },

  methods: {
    onScroll () {
      this.visible = this.el.scrollTop >= this.visibilityHeight
    },
    handleClick (e) {
      this.scrollToTop()
      this.$emit('click', e)
    },
    scrollToTop () {
      const el = this.el
      const beginTime = Date.now()
      const beginValue = el.scrollTop
      const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16))
      const frameFunc = () => {
        const progress = (Date.now() - beginTime) / 500
        if (progress < 1) {
          el.scrollTop = beginValue * (1 - easeInOutCubic(progress))
          rAF(frameFunc)
        } else {
          el.scrollTop = 0
        }
      }
      rAF(frameFunc)
    }
  }
}
</script>

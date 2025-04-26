<template>
  <div>
    <div
      ref="nowrapContentRef"
      class="nowrap-content"
    >
      {{ content }}
    </div>

    <t-popup
      v-model="visible"
      :placement="placement"
      :disabled="!exceed"
      show-arrow
      :overlay-style="{ maxWidth: '480px' }"
      :trigger="trigger"
    >
      <div
        ref="originContentRef"
        class="origin-content"
        :style="{
          '-webkit-line-clamp': line
        }"
      >
        <pre v-if="pre" class="pre-wrap">{{ content }}</pre>
        <template v-else>
          {{ content }}
        </template>
      </div>
      <template #content>
        <div :style="contentStyle">
          <pre v-if="pre" class="pre-wrap">{{ content }}</pre>
          <template v-else>
            {{ content }}
          </template>
        </div>
      </template>
    </t-popup>
  </div>
</template>

<script>
import { throttle } from 'lodash'

export default {
  name: 'MultipleOverflowTooltip',
  props: {
    content: {
      type: String,
      default: ''
    },
    line: {
      type: Number,
      default: 2
    },
    placement: {
      type: String,
      default: 'top'
    },
    trigger: {
      type: String,
      default: 'hover'
    },
    contentStyle: {
      type: [String, Object],
      default: ''
    },
    pre: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      exceed: false,
      visible: false
    }
  },
  watch: {
    content () {
      setTimeout(() => {
        this.calcOverflow()
      }, 20)
    },
    $route () {
      if (this.visible) {
        this.visible = false
      }
    }
  },
  mounted () {
    this.calcOverflow()
    const resizeHandler = throttle(() => {
      this.calcOverflow()
    }, 500)
    window.addEventListener('resize', resizeHandler)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', resizeHandler)
    })
  },
  methods: {
    calcOverflow () {
      const nowrapEl = this.$refs.nowrapContentRef
      const originEl = this.$refs.originContentRef
      if (!nowrapEl || !originEl) {
        return
      }
      const computedStyle = window.getComputedStyle(nowrapEl)
      const padding =
        parseInt(computedStyle.paddingLeft.replace('px', ''), 10) + parseInt(computedStyle.paddingRight.replace('px', ''), 10)
      const range = document.createRange()
      range.setStart(nowrapEl, 0)
      range.setEnd(nowrapEl, nowrapEl.childNodes.length)
      const rangeWidth = range.getBoundingClientRect().width
      const offsetWidth = originEl.offsetWidth * this.line
      if (rangeWidth + padding > offsetWidth || nowrapEl.scrollWidth > offsetWidth) {
        this.exceed = true
      } else {
        this.exceed = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.nowrap-content {
  position: absolute;
  left: -20000px;
  white-space: nowrap;
}
.origin-content {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
</style>

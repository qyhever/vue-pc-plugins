<template>
  <div class="text-tooltip">
    <t-tooltip
      class="item"
      :disabled="!isShowTooltip"
      :content="content"
      placement="top-start"
      popper-class="tooltip"
    >
      <div
        class="over-flow"
        :class="{ needHoverStyle: needHoverStyle }"
        :style="{ height: height, 'line-height': lineHeight, padding: padding }"
        @mouseenter="onMouseEnter"
      >
        <span ref="elementRef">{{ content || "" }}</span>
      </div>
    </t-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    // 显示内容
    content: {
      type: String,
      default: ''
    },
    // 需要鼠标hover高亮字体
    needHoverStyle: {
      type: Boolean,
      default: false
    },
    // 高度
    height: {
      type: String,
      default: '22px'
    },
    // 行度
    lineHeight: {
      type: String,
      default: '22px'
    },
    // 内边距
    padding: {
      type: String,
      default: '0 0 0 0'
    }
  },
  data () {
    return {
      isShowTooltip: false,
      elementRef: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.elementRef = this.$refs.elementRef
    })
  },
  methods: {
    // 监听鼠标移入
    onMouseEnter () {
      if (!this.elementRef) return

      const parentNode = this.elementRef.parentNode // 当前元素的父元素

      // Get parent element style
      const parentWidth = parentNode.getBoundingClientRect().width
      const paddingLeft = parseFloat(parentNode.style.paddingLeft)
      const paddingRight = parseFloat(parentNode.style.paddingRight)

      const contentWidth = this.elementRef.getBoundingClientRect().width // 当前元素的宽度
      const res = contentWidth > (parentWidth - paddingLeft - paddingRight)

      this.isShowTooltip = res
    }
  }
}
</script>

<style lang="scss" scoped>
.over-flow {
  overflow: hidden;
  white-space: nowrap;
  word-break: break-all;
  text-overflow: ellipsis;
  color: #000;
  &.needHoverStyle {
    text-overflow: clip;
    span {
      display: inline-block;
      max-width: 100.1%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &:hover {
      color: #4689ff;
    }
  }
}

div {
  margin: 0;
  height: auto;
}
</style>

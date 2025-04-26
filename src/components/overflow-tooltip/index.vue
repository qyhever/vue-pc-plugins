<template>
  <el-tooltip
    :disabled="!tooltipVisible"
    placement="top"
  >
    <template #content>
      <div style="max-width: 480px; line-height: 1.5;">
        {{ content }}
      </div>
    </template>
    <div
      class="over-flow"
      :class="{ needHoverStyle: needHoverStyle }"
      @mouseenter="onMouseEnter"
    >
      <span
        ref="elementRef"
      >
        {{ content }}
      </span>
    </div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'OverflowTooltip',
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
    }
  },
  data () {
    return {
      tooltipVisible: false
    }
  },
  methods: {
    onMouseEnter () {
      if (!this.$refs.elementRef) return
      const parentWidth = this.$refs.elementRef.parentNode.clientWidth // 当前元素的父元素宽度
      const contentWidth = this.$refs.elementRef.offsetWidth // 当前元素的宽度
      this.tooltipVisible = parentWidth <= contentWidth
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

  &.needHoverStyle {
    &:hover {
      color: #4689ff;
    }
  }
}
</style>

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
  name: 'EllipsisTooltip',
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
      const parentWidth = this.$refs.elementRef.parentNode.scrollWidth // 当前元素的父元素宽度
      const contentWidth = this.$refs.elementRef.scrollWidth // 当前元素的宽度
      const res = contentWidth > parentWidth
      this.tooltipVisible = res
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
    height: 22px;

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
</style>

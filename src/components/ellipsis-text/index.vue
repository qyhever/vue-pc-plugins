<template>
  <div class="ellipsis-text">
    <div
      v-popover:popoverEllipsis
      class="ellipsis-text__content"
      :class="isMultiple ? 'ellipsis-multiple' : 'ellipsis-single'"
      :style="contentStyle"
    >
      {{ text }}
    </div>
    <el-popover
      v-if="popoverVisible"
      ref="popoverEllipsis"
      placement="top-start"
      trigger="hover"
      popper-class="ellipsis-text-popover"
    >
      {{ text }}
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    line: {
      type: Number,
      default: 1
    },
    lineHeight: {
      type: String,
      default: '1.5em'
    },
    popoverVisible: {
      type: Boolean,
      default: true
    },
    bgc: {
      type: String,
      default: '#fff'
    }
  },
  computed: {
    isMultiple () {
      return this.line > 1
    },
    contentStyle () {
      const valueMatch = this.lineHeight.match(/\d+\.?\d*/g)
      const unitMatch = this.lineHeight.match(/[a-zA-Z]+/g)
      if (!valueMatch || !unitMatch) {
        throw new Error('lineHeight must be like 1.5em or 16px')
      }
      const value = valueMatch[0]
      const unit = unitMatch[0]
      return {
        '--bgc': this.bgc,
        '--line-height': this.lineHeight,
        '--height': value * this.line + unit
      }
    }
  }
}
</script>

<style lang="scss">
  .ellipsis-text-popover {
    max-width: 70%;
  }
  .ellipsis-text {
    // ...
  }
  .ellipsis-text__content {
    word-wrap: break-word; // 允许长单词换行到下一行
    word-break: break-all; // 允许在单词内换行
  }
  .ellipsis-single {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ellipsis-multiple {
    overflow: hidden;
    position: relative;
    line-height: var(--line-height);
    height: var(--height);
    // max-height: var(--height);
    text-align: justify;

    &:before {
      background: var(--bgc);
      content: '...';
      padding: 0 1px;
      position: absolute;
      right: 0;
      bottom: 0;
    }

    &:after {
      background: #fff;
      content: '';
      margin-top: 0.2em;
      position: absolute;
      right: 0;
      width: 1em;
      height: 1em;
    }
  }
</style>

<template>
  <div>
    <el-tooltip
      :effect="effect"
      :placement="placement"
      :disabled="text.length <= len"
      popper-class="ellipsis-popper"
    >
      <p class="ellipsis-tooltip-text">
        {{ text }}
      </p>
      <div slot="content">
        <pre class="pre-wrap break-all line-height-1-2">{{ text }}</pre>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'EllipsisTooltip',
  props: {
    text: {
      type: String,
      default: ''
    },
    effect: {
      type: String,
      default: 'light'
    },
    placement: {
      type: String,
      default: 'top'
    },
    len: {
      type: Number,
      default: 18
    }
  }
}
</script>

<style lang="scss" scoped>
.ellipsis-tooltip-text {
  max-width: 18em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1.2;
}
</style>

<style>
.ellipsis-popper {
  max-width: 80%;
}
</style>

<template>
  <div>
    <p ref="ellipsisCalc" class="ellipsis-calc line-height-1-2">
      {{ text }}
    </p>
    <el-tooltip
      :effect="effect"
      :placement="placement"
      :disabled="disabled"
      popper-class="ellipsis-popper"
    >
      <p ref="ellipsisText" class="ellipsis-tooltip-text" :style="textStyle">
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
      default: 'dark'
    },
    placement: {
      type: String,
      default: 'top'
    },
    len: {
      type: Number,
      default: 8
    }
  },
  data () {
    return {
      disabled: false
    }
  },
  computed: {
    textStyle () {
      return {
        'max-width': this.len + 'em'
      }
    }
  },
  watch: {
    text: {
      immediate: true,
      handler (newVal) {
        if (newVal) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.disabled = this.$refs.ellipsisCalc.clientWidth <= this.$refs.ellipsisText.clientWidth
            }, 20)
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ellipsis-calc {
  position: absolute;
  top: 0;
  left: -10000px;
}
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

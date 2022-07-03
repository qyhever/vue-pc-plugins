<template>
  <div ref="ellipsis" class="ellipsis-wrapper">
    <div ref="ellipsisCalc" class="ellipsis-calc line-height-1-5">
      {{ text }}
    </div>
    <el-tooltip
      :effect="effect"
      :placement="placement"
      :disabled="!visible"
      popper-class="multiple-text-popper"
    >
      <p class="ellipsis-multiple">
        {{ text }}
      </p>
      <div slot="content">
        <pre class="pre-wrap break-all line-height-1-5">{{ text }}</pre>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'MultipleText',
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
    row: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      visible: true
    }
  },
  watch: {
    text: {
      immediate: true,
      handler (newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.$refs.ellipsisCalc.style.width = this.$refs.ellipsis.clientWidth + 'px'
            setTimeout(() => {
              const height = this.$refs.ellipsisCalc.clientHeight
              // font-size 14 + 行高多出的 7
              this.visible = Number(height) > (this.row * (14 + 7))
            }, 20)
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ellipsis-wrapper {
  position: relative;
}
.ellipsis-calc {
  position: absolute;
  top: 0;
  left: -10000px;
}
</style>

<style>
.multiple-text-popper {
  max-width: 80%;
}
</style>

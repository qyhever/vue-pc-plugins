<template>
  <el-dialog
    :visible.sync="visible"
    width="400px"
    append-to-body
    :custom-class="`dialog--prompt ${customClass}`"
    :close-on-click-modal="$closeOnClickModal"
    :close-on-press-escape="$closeOnPressEscape"
    show-close
    :title="title"
  >
    <div v-if="subTitle" class="title">
      {{subTitle}}
    </div>
    <div v-if="message" class="content">{{message}}</div>
    <div slot="footer" class="dialog-footer">
      <el-button
        v-show="cancelButtonVisible"
        class="com-button--small"
        :type="cancelButtonType"
        @click="onCancelClick"
        :loading="canceling"
        size="small"
      >
        {{cancelButtonText}}
      </el-button>
			<el-button
        v-show="confirmButtonVisible"
        class="com-button--small"
        :type="confirmButtonType"
        @click="onSubmitClick"
        :loading="submiting"
        size="small"
      >
        {{confirmButtonText}}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  Dialog
} from 'element-ui'
export default {
  components: {
    [Dialog.name]: Dialog
  },
  data() {
    return {
      visible: false,
      canceling: false,
      submiting: false,
      customClass: '',
      title: '',
      message: '',
      cancelButtonVisible: true,
      confirmButtonVisible: true,
      cancelButtonType: 'default',
      confirmButtonType: 'primary',
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      onCancel: () => {}, // eslint-disable-line
      onSubmit: () => {} // eslint-disable-line
    }
  },
  methods: {
    close() {
      this.visible = false
    },
    onCancelClick() {
      const ret = this.onCancel()
      if (ret && typeof ret.then === 'function') {
        this.canceling = true
        ret
          .then(() => {
            this.canceling = false
            this.visible = false
          })
          .catch(() => {
            this.canceling = false
            this.visible = false
          })
      } else {
        this.visible = false
      }
    },
    onSubmitClick() {
      const ret = this.onSubmit()
      if (ret && typeof ret.then === 'function') {
        this.submiting = true
        ret
          .then(() => {
            this.submiting = false
            this.visible = false
          })
          .catch(() => {
            this.submiting = false
            this.visible = false
          })
      } else {
        this.visible = false
      }
    }
  }
}
</script>

<style lang="scss">
  .dialog--prompt.el-dialog {
    .el-dialog__body {
      padding-top: 30px;
      padding-left: 25px;
    }
    .title {
      font-size: 16px;
      color: $color-text-primary;
      font-weight: 700;
    }
    .content {
      margin-top: 4px;
      font-size: 14px;
      color: $color-text-secondary;
    }
  }
</style>

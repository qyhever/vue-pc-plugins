<template>
  <el-dialog
    :visible.sync="visible"
    title="选择"
    width="560px"
    append-to-body
    @close="close"
  >
    <div>
      <el-form
        ref="form"
        class="com-form"
        :model="formModel"
        label-width="96px"
      >
        <el-form-item label="当前城市：" prop="city">
          <el-select
            v-model="formModel.city"
            placeholder="请选择"
            clearable
            size="medium"
            style="width: 360px"
          >
            <el-option value="songzi" label="松滋" />
            <el-option value="baoan" label="宝安" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" class="com-button--small com-button--default" @click="close">
          取消
        </el-button>
        <el-button
          size="small"
          type="primary"
          class="com-button--small"
          @click="onSubmit"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { cloneDeep } from 'lodash'

const defaultForm = {
  city: 'songzi'
}
export default {
  name: 'SelectDialog',
  data () {
    return {
      visible: false,
      formModel: cloneDeep(defaultForm)
    }
  },
  methods: {
    open (data) {
      if (data) {
        this.$nextTick(() => {
          this.formModel.city = data
        })
      }
      this.visible = true
    },
    close () {
      this.visible = false
      this.$refs.form.resetFields()
      this.formModel = cloneDeep(defaultForm)
    },
    onSubmit () {
      this.$refs.form.validate(async valid => {
        if (!valid) {
          return
        }
        this.$emit('confirm', this.formModel.city)
        this.visible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item--remark {
  margin-bottom: 0;
}
</style>

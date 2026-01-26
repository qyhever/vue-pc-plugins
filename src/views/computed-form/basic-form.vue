<template>
  <div style="width: 400px">
    <el-form
      :model="formModel"
    >
      <el-form-item label="姓名">
        <el-input v-model="formModel.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="formModel.mobile" clearable></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'BasicForm',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  computed: {
    formModel: {
      get () {
        const vm = this
        const proxy = new Proxy(this.formData, {
          get (target, key) {
            return Reflect.get(target, key)
          },
          set (target, key, value) {
            const newData = {
              ...target,
              [key]: value
            }
            vm.$emit('update:form-data', newData)
            return true
          }
        })
        return proxy
      }
    }
  }
}
</script>

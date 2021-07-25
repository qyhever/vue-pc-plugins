<template>
  <el-date-picker
    :value="value"
    type="monthrange"
    value-format="yyyy-MM"
    align="right"
    range-separator="至"
    start-placeholder="开始月份"
    end-placeholder="结束月份"
    :picker-options="pickerOptions"
    v-bind="$attrs"
    @input="onChange"
    v-on="$listeners"
  />
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '本月',
            onClick (picker) {
              picker.$emit('pick', [new Date(), new Date()])
            }
          },
          {
            text: '今年至今',
            onClick (picker) {
              const end = new Date()
              const start = new Date(new Date().getFullYear(), 0)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近六个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 6)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  methods: {
    onChange (val) {
      this.$emit('change', val)
    }
  }
}
</script>

<template>
  <el-date-picker
    :value="value"
    type="daterange"
    value-format="yyyy-MM-dd"
    align="right"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :picker-options="pickerOptions"
    v-bind="$attrs"
    @input="onChange"
    v-on="$listeners"
  />
</template>

<script>
import dayjs from 'dayjs'
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
            text: '今天',
            onClick (picker) {
              const start = new Date()
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick (picker) {
              const start = new Date()
              start.setDate(start.getDate() - 1)
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近3天',
            onClick (picker) {
              const start = new Date()
              start.setDate(start.getDate() - 2)
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近7天',
            onClick (picker) {
              const start = new Date()
              start.setDate(start.getDate() - 6)
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近30天',
            onClick (picker) {
              const start = new Date()
              start.setDate(start.getDate() - 29)
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本周',
            onClick (picker) {
              const start = dayjs().day(1).format('YYYY-MM-DD') // 本周一
              const end = new Date()
              picker.$emit('pick', [new Date(start), end])
            }
          },
          {
            text: '上周',
            onClick (picker) {
              const start = dayjs().day(-6).format('YYYY-MM-DD') // 上周一
              const end = dayjs().day(0).format('YYYY-MM-DD') // 上周日
              picker.$emit('pick', [new Date(start), new Date(end)])
            }
          },
          {
            text: '本月',
            onClick (picker) {
              const start = dayjs().date(1).format('YYYY-MM-DD') // 本月第一天
              const end = new Date()
              picker.$emit('pick', [new Date(start), end])
            }
          },
          {
            text: '上月',
            onClick (picker) {
              const startDate = new Date()
              startDate.setMonth(startDate.getMonth() - 1)
              const start = dayjs(startDate).date(1).format('YYYY-MM-DD') // 上月第一天
              const endDate = new Date()
              const end = dayjs(endDate).date(0).format('YYYY-MM-DD') // 上月最后一天（本月第一天的前一天）
              picker.$emit('pick', [new Date(start), new Date(end)])
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

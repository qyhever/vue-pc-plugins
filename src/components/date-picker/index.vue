<template>
  <el-date-picker
    :value="value"
    type="date"
    :placeholder="placeholder"
    :value-format="valueFormat"
    :picker-options="pickerOptions"
    size="medium"
    v-bind="$attrs"
    v-on="$listeners"
    @change="onChange"
  />
</template>

<script>
import dayjs from 'dayjs'
import { getCommonHolidayDict } from '@/api/global'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '选择日期'
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    size: {
      type: String,
      default: 'medium'
    },
    disabledHoliday: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pickerOptions: {}
    }
  },
  created () {
    this.pickerOptions.disabledDate = (date) => {
      return dayjs(date).isBefore(dayjs(), 'day')
    }
    if (this.disabledHoliday) {
      getCommonHolidayDict({
        nextDay: 180
      }).then(holidays => {
        this.pickerOptions.disabledDate = (date) => {
          const dateStr = dayjs(date).format('YYYY-MM-DD')
          if (holidays.indexOf(dateStr) >= 0) {
            return true
          }
          return dayjs(date).isBefore(dayjs(), 'day')
        }
      }).catch(console.log)
    }
  },
  methods: {
    onChange (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style>

</style>

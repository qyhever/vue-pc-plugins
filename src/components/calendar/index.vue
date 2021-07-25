<template>
  <div class="v-calendar-table-list">
    <div
      v-for="(monthItem, monthIndex) in calendarData"
      :key="monthIndex"
      class="v-calendar-col"
    >
      <div class="v-calendar-table">
        <div class="v-calendar-table__weeks">
          <div
            v-for="(item, index) in weekDayList"
            :key="index"
            class="v-calendar-table__week-item"
          >
            {{ item.label }}
          </div>
        </div>
        <div class="v-calendar-table__dates">
          <div class="v-calendar-month-mark">
            {{ monthItem.month }}
          </div>
          <div
            v-for="(row, rowIndex) in getGroupArray(monthItem.dateList, 7)"
            :key="rowIndex"
            class="v-date-item-row"
          >
            <div
              v-for="(item, index) in row"
              :key="index"
              class="v-date-item-col"
            >
              <div
                v-if="item.type === 'current'"
                class="v-date-item-colinner"
                :class="{selected: item.selected}"
                @click="onDateItemClick({ monthItem, monthIndex, dateItem: item, dateIndex: rowIndex * 7 + index })"
              >
                <span class="v-date-item-text">{{ item.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getGroupArray,
  getWeekDayList,
  getWeekMapDays,
  getNormalizedCalendarData,
  WEEK_DAY_LIST
} from './utils'
export default {
  props: {
    firstDayOfWeek: {
      type: Number,
      default: 1
    },
    year: {
      type: Number,
      default: new Date().getFullYear()
    },
    currentWeek: {
      type: Array,
      default: () => [],
      validator: val => {
        return val.every(item => {
          return WEEK_DAY_LIST.map(v => v.value).includes(item)
        })
      }
    },
    selectedDateList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      calendarData: [] // 每个月有补充的天数
    }
  },
  computed: {
    weekDayList () {
      return getWeekDayList(this.firstDayOfWeek)
    },
    weekMapDays () {
      return getWeekMapDays(this.year)
    }
  },
  watch: {
    year: {
      handler (newYear) {
        this.$emit('update:currentWeek', []) // 先清空
        this.setCalendarData()
        // active top week
        let filteredDateList = this.selectedDateList.filter(v => {
          return new Date(v.text).getFullYear() === newYear && v.type === 'current'
        })
        if (filteredDateList.length) {
          const currentWeekMapDays = getWeekMapDays(null, filteredDateList.map(v => v.text))
          const result = []
          for (const k1 in this.weekMapDays) {
            for (const k2 in currentWeekMapDays) {
              if (k1 === k2 && this.weekMapDays[k1] === currentWeekMapDays[k2]) {
                if (!this.currentWeek.includes(Number(k1))) {
                  result.push(Number(k1))
                }
                break
              }
            }
          }
          this.$emit('update:currentWeek', this.currentWeek.concat(result))
        }
        // active select
        this.calendarData = this.calendarData.map(monthItem => {
          const dateList = monthItem.dateList.map(dateItem => {
            const currentDateItem = filteredDateList.find(v => v.text === dateItem.text)
            if (currentDateItem) {
              filteredDateList = filteredDateList.filter(v => v.text !== currentDateItem.text) // 性能优化，找出来的丢掉，下次不再找了
              return {
                ...dateItem,
                selected: true
              }
            }
            return dateItem
          })
          return {
            ...monthItem,
            dateList
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    getGroupArray,
    setCalendarData () {
      this.calendarData = getNormalizedCalendarData(this.year, this.firstDayOfWeek)
    },
    onDateItemClick (options) {
      this.calendarData = this.calendarData.map(monthItem => {
        if (options.monthItem.month === monthItem.month) {
          const dateList = monthItem.dateList.map(dateItem => {
            if (options.dateItem.date === dateItem.date) {
              return {
                ...dateItem,
                selected: !dateItem.selected
              }
            }
            return dateItem
          })
          return {
            ...monthItem,
            dateList
          }
        }
        return monthItem
      })
      this.setSelectedDateList()
      // update:currentWeek
      const currentDateItem = this.calendarData[options.monthIndex].dateList[options.dateIndex]
      if (!currentDateItem.selected) { // 取消选中，需要取消上方对应全选
        const currentWeek = this.currentWeek.filter(v => v !== currentDateItem.day)
        this.$emit('update:currentWeek', currentWeek)
        return
      }
      let weekDayLengh = 0
      // 计算本天对应周几有多少天
      this.calendarData.forEach(monthItem => {
        monthItem.dateList.forEach(dateItem => {
          if (options.dateItem.day === dateItem.day && dateItem.selected && dateItem.type === 'current') {
            weekDayLengh += 1
          }
        })
      })
      if (weekDayLengh === this.weekMapDays[options.dateItem.day]) {
        if (!this.currentWeek.includes(options.dateItem.day)) {
          this.$emit('update:currentWeek', this.currentWeek.concat(options.dateItem.day))
        }
      }
    },
    setSelectedDateList () {
      const addList = []
      const deleteList = []
      this.calendarData.forEach(monthItem => {
        monthItem.dateList.forEach(dateItem => {
          if (dateItem.type === 'current') {
            // add
            if (
              !this.selectedDateList.some(v => v.text === dateItem.text) && // 不存在
              dateItem.selected
            ) {
              addList.push(dateItem)
            }
            // delete
            if (
              this.selectedDateList.some(v => v.text === dateItem.text) && // 存在
              !dateItem.selected
            ) {
              deleteList.push(dateItem)
            }
          }
        })
      })
      const result = this.selectedDateList
        .filter(v => {
          return !deleteList.some(item => item.text === v.text)
        })
        .concat(addList)
      this.$emit('update:selectedDateList', result)
    },
    updateCalendarDataByWeek (value, checked) {
      this.calendarData = this.calendarData.map(monthItem => {
        const dateList = monthItem.dateList.map(dateItem => {
          if (value === dateItem.day) {
            return {
              ...dateItem,
              selected: checked
            }
          }
          return dateItem
        })
        return {
          ...monthItem,
          dateList
        }
      })
      this.setSelectedDateList()
    }
  }
}
</script>

<style lang="scss">
.v-calendar-table-list {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
  margin-right: -10px;
}
.v-calendar-col {
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 20px;
}
.v-calendar-table {
  position: relative;
  width: 300px;
  height: 300px;
  border: 1px solid #eee;
}
.v-calendar-table__weeks {
  display: flex;
  box-shadow: 0 2px 10px rgb(125 126 128 / 16%);
}
.v-calendar-table__week-item {
  flex-grow: 1;
  line-height: 36px;
  text-align: center;
}
.v-calendar-month-mark {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 0;
  color: rgba(242, 243, 245, 0.8);
  font-size: 160px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.v-date-item-row {
  display: flex;
}
.v-date-item-col {
  flex-grow: 1;
  line-height: 30px;
  text-align: center;
}
.v-date-item-colinner {
  position: relative;
  height: 0;
  padding-bottom: 100%;
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: #e6f7ff;
  }
  &.selected {
    background-color: #1890ff;
    color: #fff;
  }
}
.v-date-item-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

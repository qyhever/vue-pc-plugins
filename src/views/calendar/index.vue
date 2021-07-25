<template>
  <div class="page">
    <div class="v-calendar-wrapper">
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        style="margin-bottom: 1px;"
      >
        <el-checkbox-group v-model="currentWeek">
          <el-checkbox-button
            v-for="(item, index) in weekDayList"
            :key="index"
            :label="item.value"
            @click.native="onWeekItemClick(item.value)"
          >
            {{ item.label }}
          </el-checkbox-button>
        </el-checkbox-group>
        <el-select v-model="currentYear">
          <el-option
            v-for="(item, index) in yearList"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-row>
      <CalendarComponent
        ref="calendar"
        :year="currentYear"
        :selected-date-list.sync="selectedDateList"
        :current-week.sync="currentWeek"
      />
    </div>
  </div>
</template>

<script>
import CalendarComponent from '@/components/calendar'
import {
  getWeekDayList
} from './utils'
export default {
  name: 'CalendarPage',
  components: {
    CalendarComponent
  },
  data () {
    return {
      currentWeek: [],
      selectedDateList: [],
      currentYear: new Date().getFullYear(),
      yearList: [
        2017,
        2018,
        2019,
        2020,
        2021
      ]
    }
  },
  computed: {
    weekDayList () {
      return getWeekDayList(this.firstDayOfWeek)
    }
  },
  mounted () {
    // console.log(getCalendarData({year: 2020}))
  },
  methods: {
    onWeekItemClick (value) {
      // 在下一个队列，才能获取到更新之后的 currentWeek
      setTimeout(() => {
        const checked = this.currentWeek.includes(value) // 存在选中，否则取消
        this.$refs.calendar.updateCalendarDataByWeek(value, checked)
      }, 20)
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding: 30px 30px 0;
}
.v-calendar-wrapper {
  overflow: hidden;
}
.v-calendar-table-list {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
  margin-right: -10px;
}
.v-col {
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
.v-month-mark {
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

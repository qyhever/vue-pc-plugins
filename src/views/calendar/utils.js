import dayjs from 'dayjs'

export const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']
export const WEEK_DAY_LIST = [
  { label: '日', value: 0 },
  { label: '一', value: 1 },
  { label: '二', value: 2 },
  { label: '三', value: 3 },
  { label: '四', value: 4 },
  { label: '五', value: 5 },
  { label: '六', value: 6 }
]

/**
 * 数组分组
 * @param {Array} list 数组
 * @param {Number} len 每组数量
 * @return {Array} 二维数组
 */
export function getGroupArray (list, len) {
  const ret = []
  list.forEach((item, index) => {
    const groupIndex = Math.floor(index / len)
    if (!ret[groupIndex]) {
      ret[groupIndex] = []
    }
    ret[groupIndex].push(item)
  })
  return ret
}

/**
 * 获取周列表
 * @param {Number} start 从周几开始
 * @return {Array<String>} 周列表
 */
export function getWeekDays (start = 1) {
  if (typeof start !== 'number' || start === 0) {
    return WEEK_DAYS.slice()
  }
  return WEEK_DAYS.slice(start).concat(WEEK_DAYS.slice(0, start))
}

/**
 * 获取周列表(数组项为对象)
 * @param {Number} start 从周几开始
 * @return {Array}
 */
export function getWeekDayList (start = 1) {
  if (typeof start !== 'number' || start === 0) {
    return WEEK_DAY_LIST.slice()
  }
  return WEEK_DAY_LIST.slice(start).concat(WEEK_DAY_LIST.slice(0, start))
}

/**
 * 创建一个从 1 到 n 的数组
 * @param {Array} n 结束值
 * @return {Array<Number>} 数组
 */
export function createArray (n) {
  // see https://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
  return Array.apply(null, { length: n }).map((_, i) => i + 1)
}

/**
 * 获取当前日期当月第一天为周几
 * @param {Date} date 日期对象
 * @return {Number} 周几
 */
export function getFirstDayOfMonth (date) {
  const temp = new Date(date.getTime())
  temp.setDate(1)
  return temp.getDay()
}

/**
 * 获取上个月最后几天
 */
export function getPrevMonthLastDays (date, amount) {
  if (amount <= 0) {
    return []
  }
  const temp = new Date(date.getTime())
  temp.setDate(0)
  const lastDay = temp.getDate()
  return createArray(amount).map((_, index) => lastDay - (amount - index - 1))
}

/**
 * 获取某年的所有天数（字符串 YYYY-MM-DD 格式）
 * @param {Number} year 年份
 * @return {Array<String>} 天数
 */
export function getDateListByYear (year = new Date().getFullYear()) {
  const ret = []
  const monthNumList = createArray(12) // [1, 2, ..., 12]
  monthNumList.forEach(monthNum => {
    // new Date 的 month 是从 0 开始的
    const tempMonth = new Date(year, monthNum, 0) // 上月最后一天，当月第一天的前一天 eg. 传入 7, 返回 2021-7-31
    const dateLength = tempMonth.getDate() // 28 | 29 | 30 | 31
    const dateNumList = createArray(dateLength) // [1, 2, ..., 30]
    dateNumList.forEach(dateNum => {
      const tempDate = new Date(year, monthNum - 1, dateNum)
      const dateText = dayjs(tempDate).format('YYYY-MM-DD')
      ret.push(dateText)
    })
  })
  return ret
}

/**
 * 获取某年的(或者给定数据的)所有周几对应的天数
 * @param {Number} year 年份
 * @param {Array<String>} list 日期字符串数组
 * @return {Object} 天数 eg. { 0: 52, 1: 52 ... }
 */
export function getWeekMapDays (year, list) {
  const ret = {}
  const dateList = list || getDateListByYear(year)
  dateList.forEach(dateText => {
    const day = new Date(dateText).getDay()
    if (!ret[day]) {
      ret[day] = 0
    }
    ret[day] += 1
  })
  return ret
}

/**
 * 获取日历数据
 * @param {Object} options 选项参数
 * @param {Number} [options.year = new Date().getFullYear()] 年
 * @param {Number} options.month 月
 * @return {Array}
 */
export function getCalendarData ({ year = new Date().getFullYear(), month } = {}) {
  if (month) {
    console.log('month', month)
  }
  const result = []
  const d = new Date(year, 0, 0)
  const monthLength = d.getMonth() + 1 // 12
  const monthIndexList = createArray(monthLength) // [1, 2, ..., 12]
  for (let i = 0; i < monthIndexList.length; i++) {
    const monthIndex = monthIndexList[i]
    const tempMonth = new Date(year, monthIndex, 0) // 当月最后一天
    const dateLength = tempMonth.getDate() // 28 | 29 | 30 | 31
    const dateIndexList = createArray(dateLength) // [1, 2, ..., 30]
    const dateList = dateIndexList.map(dateIndex => {
      const tempDate = new Date(year, monthIndex - 1, dateIndex)
      const dateText = dayjs(tempDate).format('YYYY-MM-DD')
      return {
        date: dateIndex,
        text: dateText,
        day: tempDate.getDay()
      }
    })
    result.push({
      month: monthIndex,
      text: dayjs(tempMonth).format('YYYY-MM'),
      dateList
    })
  }
  return result
}

/*
[
  {
    month: 1,
    text: '2021-01',
    dateList: [
      {
        date: 1,
        text: '2021-01-01',
        day: 1
      },
      {
        date: 2,
        text: '2021-01-02',
        day: 2
      }
    ]
  }
]
*/

/**
 * 获取日历数据（补全后的数据，每月开始和结束用上月或者下月的日期补全，每个月的天数为 7 的倍数，方便布局）
 * @param {Number} year 年份
 * @param {Number} firstDayOfWeek 第一天从周几开始
 * @return {Array}
 */
export function getNormalizedCalendarData (year, firstDayOfWeek) {
  const tempData = getCalendarData({
    year
  })
  tempData.forEach(item => {
    const d = new Date(item.text)
    let firstDay = getFirstDayOfMonth(d)
    firstDay = firstDay === 0 ? 7 : firstDay // 0 to 7
    const offset = (7 + firstDay - firstDayOfWeek) % 7

    // prevent month
    const prevMonthDays = getPrevMonthLastDays(d, offset).map(dateN => {
      const tempD = new Date(year, item.month - 2, dateN)
      return {
        date: dateN,
        text: dayjs(tempD).format('YYYY-MM-DD'),
        day: tempD.getDay(),
        type: 'prevent'
      }
    })

    // current month
    const currentMonthDays = item.dateList.map(item => ({
      ...item,
      type: 'current'
    }))
    let dates = [...prevMonthDays, ...currentMonthDays]

    // next month
    const remainDateLength = dates.length % 7 // 多余天数
    if (remainDateLength) {
      const nextMonthDays = createArray(7 - remainDateLength).map((_, index) => {
        const dateN = index + 1
        const tempD = new Date(year, item.month, dateN)
        return {
          date: dateN,
          text: dayjs(tempD).format('YYYY-MM-DD'),
          day: tempD.getDay(),
          type: 'next'
        }
      })
      dates = dates.concat(nextMonthDays)
    }
    item.dateList = dates
  })
  return tempData
}

function calc_rank(experience) {
  experience = Number(experience)
  if (experience < 50) return {level: 0, experience, total: 50}
  if (experience < 120) return {level: 1, experience, total: 120}
  if (experience < 300) return {level: 2, experience, total: 300}
  if (experience < 800) return {level: 3, experience, total: 800}
  if (experience < 2000) return {level: 4, experience, total: 2000}
  if (experience < 5000) return {level: 5, experience, total: 5000}
  return {level: 6, experience, total: "--"}
}

class DateParser {
  constructor(dateString = null) {
    this.date = dateString ? new Date(dateString) : new Date()
  }

  seconds() {
    return this.date.getSeconds()
  }

  hours() {
    return this.date.getHours()
  }

  minutes() {
    return this.date.getMinutes()
  }

  day() {
    return this.date.getDate()
  }

  month() {
    return this.date.getMonth() + 1
  }

  year() {
    return this.date.getFullYear()
  }

  //16:25
  hours_minutes() {
    return this.hours().toString().padStart(2, "0") + ":" + this.minutes().toString().padStart(2, "0")
  }

  //10-21
  month_day() {
    return this.month().toString().padStart(2, "0") + "-" + this.day().toString().padStart(2, "0")
  }

  //10-21 16:25
  month_day_hours_minutes() {
    return this.month_day() + " " + this.hours_minutes()
  }

  //2021-10-21
  year_month_day() {
    return this.year() + "-" + this.month_day()
  }

  all() {
    return this.year_month_day() + " " + this.hours_minutes()
  }
}

let filters = {
  date(value) {
    let nowDate = new DateParser()
    let valueDate = new DateParser(value)
    if (nowDate.year() > valueDate.year()) return valueDate.year_month_day()
    if (nowDate.month_day() > valueDate.month_day()) return valueDate.month_day()
    if (nowDate.hours() > valueDate.hours()) return `${nowDate.hours() - valueDate.hours()}小时前`
    if (nowDate.minutes() > valueDate.minutes()) return `${nowDate.minutes() - valueDate.minutes()}分钟前`
    if (nowDate.seconds() > valueDate.seconds()) return `${nowDate.seconds() - valueDate.seconds()}秒前`
    return "刚刚"
  },
  max_width(str, width) {
    if (!str?.length) return str
    if (str.length <= width) {
      return str
    } else {
      return str.substring(0, width) + "..."
    }
  }
}

let up_down = function (is_up, obj) {
  if (!is_up) {
    if (obj.is_up === null) {
      obj.is_up = false
      obj.down_num++
    } else {
      if (obj.is_up) {
        obj.up_num--
        obj.down_num++
        obj.is_up = false
      } else {
        obj.down_num--
        obj.is_up = null
      }
    }
  } else {
    if (obj.is_up === null) {
      obj.is_up = true
      obj.up_num++
    } else {
      if (obj.is_up) {
        obj.up_num--
        obj.is_up = null
      } else {
        obj.up_num++
        obj.down_num--
        obj.is_up = true
      }
    }
  }
}

function mutex(store, newValue, oldValue) {
  if (newValue) {
    store.commit("lock")
  }
  if (oldValue) {
    store.commit("unlock")
  }
}

export default {
  calc_rank,
  DateParser,
  filters,
  up_down,
  mutex
}
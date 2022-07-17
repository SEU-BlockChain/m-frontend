let experience_list = [120, 600, 3600, 12000, 24000, 48000, 96000, 180000, 360000]


function calc_rank(experience) {
  experience = Number(experience)
  for (let i = 0; i < experience_list.length; i++) {
    if (experience < experience_list[i]) return {level: i + 1, experience, total: experience_list[i]}
  }
  return {level: experience_list.length + 1, experience, total: "--"}
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
  },
  simple_address(address) {
    return address.substr(0, 5) + "..." + address.substr(38);
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
  experience_list,
  calc_rank,
  DateParser,
  filters,
  up_down,
  mutex
}
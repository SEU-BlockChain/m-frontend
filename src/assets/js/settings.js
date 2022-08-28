let cos_url = "https://cos.chain.seutools.com/"
// let api_url = process.env.NODE_ENV === 'production' ? "https://api.chain.seutools.com/" : "http://127.0.0.1:8000/"
// let api_url ="https://api.chain.seutools.com/"
let api_url ="http://10.203.170.234:8000/"


let re_pattens = {
  username: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,16}$/,
  description: /^.{0,100}$/,
  password: /^[a-zA-Z0-9-*/+.~!@#$%^&()]{6,16}$/,
  phone: /^1[3-9][0-9]{9}$/,
  code: /^[0-9]{4}$/,
}

let validators = {
  username: [
    v => 16 >= v.length && v.length >= 1 || '长度在 1 到 16 个字符',
    v => re_pattens.username.test(v) || "不能含有非法字符",
  ],
  description: [
    v => re_pattens.description.test(v) || "字数100字符内",
  ],
  password: [
    v => 16 >= v.length && v.length >= 6 || '长度在 6 到 16 个字符',
    v => re_pattens.password.test(v) || "不能含有非法字符",
  ],
  confirm_password: password => [
    v => 16 >= v.length && v.length >= 6 || '长度在 6 到 16 个字符',
    v => re_pattens.password.test(v) || "不能含有非法字符",
    v => password === v || "两次密码不一致"
  ],
  phone: [
    v => re_pattens.phone.test(v) || "请输入11位电话号码"
  ],
  code: [
    v => re_pattens.code.test(v) || "4位数验证码"
  ],
}


function scrollAnimation(targetY) {
  const currentY = document.documentElement.scrollTop || document.body.scrollTop

  let needScrollTop = targetY - currentY
  let _currentY = currentY
  setTimeout(() => {
    // 一次调用滑动帧数，每次调用会不一样
    const dist = Math.ceil(needScrollTop / 10)
    _currentY += dist
    window.scrollTo(0, _currentY)
    // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
    if (needScrollTop > 10 || needScrollTop < -10) {
      scrollAnimation(targetY)
    } else {
      window.scrollTo(0, targetY)
    }
  }, 1)
}

export {
  api_url
}

export default {
  cos_url,
  api_url,
  validators,
  re_pattens,
  scrollAnimation
}

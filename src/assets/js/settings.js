let cos_url = "https://cos.chain.seutools.com/"
// let api_url = "https://api.chain.seutools.com/"
let api_url = "http://127.0.0.1:8000/"


let re_pattens = {
  username: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,16}$/,
  password: /^[a-zA-Z0-9-*/+.~!@#$%^&()]{6,16}$/,
  phone: /^1[3-9][0-9]{9}$/,
  code: /^[0-9]{4}$/,
}

let validators = {
  username: [
    v => re_pattens.username.test(v) || "请输入9位一卡通号",
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
export {
  api_url
}

export default {
  cos_url,
  api_url,
  validators,
  re_pattens
}
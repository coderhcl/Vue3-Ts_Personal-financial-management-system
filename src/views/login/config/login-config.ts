// 验证规则
export const loginRules = {
  name: [
    {
      required: true,
      message: "请输入账号！",
      trigger: "blur"
    },
    {
      pattern: /^[a-z0-9]{5,15}$/,
      message: "账号必须5-15个字母或数字",
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: "请输入密码！",
      trigger: "blur"
    },
    {
      pattern: /^[a-z0-9]{3,}$/,
      message: "密码必须3位以上字母或数字",
      trigger: "blur"
    }
  ],
  validCode: {
    required: true,
    message: "请输入验证码！",
    trigger: "blur"
  }
}

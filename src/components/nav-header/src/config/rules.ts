export const passwordRules = {
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
  confirmPassword: [
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
  ]
}

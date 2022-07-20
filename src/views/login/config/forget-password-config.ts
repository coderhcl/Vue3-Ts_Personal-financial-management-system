// 验证规则
export const numberRules = {
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
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern:
        /^[1](([3][0-9])|([4][0,1,4-9])|([5][0-3,5-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0-3,5-9]))[0-9]{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ],
  email: [
    {
      required: true,
      message: "请输入邮箱地址",
      trigger: "blur"
    },
    {
      type: "email",
      message: "请输入正确邮箱地址",
      trigger: ["blur", "change"]
    }
  ],
  code: {
    required: true,
    message: "请输入邮箱验证码",
    trigger: "blur"
  }
}

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
      message: "请确认密码！",
      trigger: "blur"
    },
    {
      pattern: /^[a-z0-9]{3,}$/,
      message: "密码必须3位以上字母或数字",
      trigger: "blur"
    }
  ]
}

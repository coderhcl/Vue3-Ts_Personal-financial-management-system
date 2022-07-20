// 验证规则
export const rules = {
  category: [
    {
      required: true,
      message: "选择类别",
      trigger: "blur"
    }
  ],
  money: [
    {
      required: true,
      message: "请输入金钱数量",
      trigger: "blur"
    },
    {
      pattern: /^[0-9]{1,}$/,
      message: "密码必须为数字",
      trigger: "blur"
    }
  ],
  remark: [
    {
      required: true,
      message: "请输入备注",
      trigger: "blur"
    }
  ],
  createTime: {
    required: true,
    message: "请选择时间",
    trigger: "blur"
  },
  name: {
    required: true,
    message: "请输入名称",
    trigger: "blur"
  },
  expirationTime: {
    required: true,
    message: "请选择时间",
    trigger: "blur"
  }
}

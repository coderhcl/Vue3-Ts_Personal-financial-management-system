export const tableConfig = {
  title: "用户列表",
  propList: [
    { prop: "name", label: "账号", minWidth: "100", slotName: "name" },
    { prop: "roleId", label: "身份", minWidth: "100", slotName: "roleId" },
    { prop: "phone", label: "手机号码", minWidth: "150", slotName: "phone" },
    { prop: "email", label: "邮箱", minWidth: "200", slotName: "email" },
    {
      prop: "createTimes",
      label: "创建时间",
      minWidth: "200",
      slotName: "createTimes"
    },
    {
      prop: "updateTime",
      label: "更新时间",
      minWidth: "200",
      slotName: "updateTime"
    },
    {
      label: "操作",
      minWidth: "150",
      slotName: "handler"
    }
  ]
}

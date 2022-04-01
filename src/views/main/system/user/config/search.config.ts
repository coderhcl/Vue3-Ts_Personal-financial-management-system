import { IForm } from "@/base-ui/form"

export const searchFormConfig: IForm = {
  labelWidth: "120px",
  itemStyle: {
    padding: "5px 15px"
  },
  colLayout: {
    xl: 6,
    lg: 8,
    md: 12,
    sm: 24,
    xs: 24
  },
  formItems: [
    {
      field: "name",
      type: "input",
      label: "用户名",
      placeholder: "请输入用户名"
    },
    {
      field: "phone",
      type: "input",
      label: "手机号",
      placeholder: "请输入手机号"
    },
    {
      field: "email",
      type: "input",
      label: "邮箱",
      placeholder: "请输入邮箱"
    },
    {
      field: "roleId",
      type: "select",
      label: "角色",
      placeholder: "请选择角色",
      options: [
        { label: "管理员", value: 1 },
        { label: "普通用户", value: 2 }
      ]
    },
    {
      field: "createTime",
      type: "datepicker",
      label: "创建时间",
      otherOptions: {
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
        type: "daterange"
      }
    }
  ]
}

// name: [
//   {
//     required: true,
//     message: "请输入账号！",
//     trigger: "blur"
//   },
//   {
//     pattern: /^[a-z0-9]{5,15}$/,
//     message: "账号必须5-15个字母或数字",
//     trigger: "blur"
//   }
// ],
// password: [
//   {
//     required: true,
//     message: "请输入密码！",
//     trigger: "blur"
//   },
//   {
//     pattern: /^[a-z0-9]{3,}$/,
//     message: "密码必须3位以上字母或数字",
//     trigger: "blur"
//   }
// ]

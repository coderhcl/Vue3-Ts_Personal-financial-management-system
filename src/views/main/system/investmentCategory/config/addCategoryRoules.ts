export const rules = {
  name: [
    {
      required: true,
      message: "请输入分类",
      trigger: "blur"
    },
    {
      min: 1,
      max: 5,
      message: "字数在3-5个字",
      trigger: "blur"
    }
  ]
}

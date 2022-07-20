export const rules = {
  title: [
    {
      required: true,
      message: "请输入标题",
      trigger: "blur"
    },
    {
      min: 1,
      max: 20,
      message: "字数在1-10个字",
      trigger: "blur"
    }
  ],
  content: { required: true, message: "请输入公告内容", trigger: "blur" }
}

const expenseManage = () =>
  import("@/views/main/property/expenseManage/expenseManage.vue")
export default {
  path: "/main/property/expenseManage",
  name: "expenseManage",
  component: expenseManage,
  children: []
}

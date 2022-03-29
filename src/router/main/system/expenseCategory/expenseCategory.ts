const expenseCategory = () =>
  import("@/views/main/system/expenseCategory/expenseCategory.vue")
export default {
  path: "/main/system/expenseCategory",
  name: "expenseCategory",
  component: expenseCategory,
  children: []
}

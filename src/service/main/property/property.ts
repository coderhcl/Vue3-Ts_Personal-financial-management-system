import CLRequest from "@/service"
// ############# 收入 #################
// 获取收入分类
export function getIncomeCategory() {
  return CLRequest.get({
    url: "/income/category"
  })
}
// 添加收入
export function addIncomeApi(data: any) {
  return CLRequest.post({
    url: "/income/addincome",
    data: data
  })
}
// 获取收入列表
export function getIncomeListApi(data: any) {
  return CLRequest.post({
    url: "/income/getincome",
    data: data
  })
}
// 删除收入
export function deleteIncomeApi(id: string) {
  return CLRequest.delete({
    url: "/income/delete/" + id
  })
}
// 更新收入
export function updateIncomeApi(id: string, data: any) {
  return CLRequest.patch({
    url: "/income/patchincome/" + id,
    data: data
  })
}

// 获取收入echart数据
export function getIncomeChartData(data: any) {
  return CLRequest.post({
    url: "/income/chart",
    data: data
  })
}
// 获取一年收入数据
export function getYearIncomeListApi(data: any) {
  return CLRequest.post({
    url: "/income/yearchart",
    data: data
  })
}
// ############# 支出 #################
// 获取支出分类
export function getExpenseCategory() {
  return CLRequest.get({
    url: "/expense/category"
  })
}
// 添加支出
export function addExpenseApi(data: any) {
  return CLRequest.post({
    url: "/expense/addexpense",
    data: data
  })
}
// 获取支出列表
export function getExpenseListApi(data: any) {
  return CLRequest.post({
    url: "/expense/getexpense",
    data: data
  })
}
// 删除支出
export function deleteExpenseApi(id: string) {
  return CLRequest.delete({
    url: "/expense/delete/" + id
  })
}
// 更新支出
export function updateExpenseApi(id: string, data: any) {
  return CLRequest.patch({
    url: "/expense/patchexpense/" + id,
    data: data
  })
}

// 获取支出echart数据
export function getExpenseChartData(data: any) {
  return CLRequest.post({
    url: "/expense/chart",
    data: data
  })
}
// 获取一年支出数据
export function getYearExpenseListApi(data: any) {
  return CLRequest.post({
    url: "/expense/yearchart",
    data: data
  })
}

// ###############债务#################
// 获取债务分类
export function getDebtCategory() {
  return CLRequest.get({
    url: "/debt/category"
  })
}
// 添加债务
export function addDebtApi(data: any) {
  return CLRequest.post({
    url: "/debt/adddebt",
    data: data
  })
}
// 获取债务列表
export function getDebtListApi(data: any) {
  return CLRequest.post({
    url: "/debt/getdebt",
    data: data
  })
}
// 删除债务
export function deleteDebtApi(id: string) {
  return CLRequest.delete({
    url: "/debt/delete/" + id
  })
}
// 更新债务
export function updateDebtApi(id: string, data: any) {
  return CLRequest.patch({
    url: "/debt/patchdebt/" + id,
    data: data
  })
}

// 获取债务echart数据
export function getDebtChartData(data: any) {
  return CLRequest.post({
    url: "/debt/chart",
    data: data
  })
}
// 获取一年债务数据
export function getYearDebtListApi(data: any) {
  return CLRequest.post({
    url: "/debt/yearchart",
    data: data
  })
}

// ###############投资#################
// 获取投资分类
export function getInvestmentCategory() {
  return CLRequest.get({
    url: "/investment/category"
  })
}
// 添加债务
export function addInvestmentApi(data: any) {
  return CLRequest.post({
    url: "/investment/addinvestment",
    data: data
  })
}
// 获取债务列表
export function getInvestmentListApi(data: any) {
  return CLRequest.post({
    url: "/investment/getinvestment",
    data: data
  })
}
// 删除债务
export function deleteInvestmentApi(id: string) {
  return CLRequest.delete({
    url: "/investment/delete/" + id
  })
}
// 更新债务
export function updateInvestmentApi(id: string, data: any) {
  return CLRequest.patch({
    url: "/investment/patchinvestment/" + id,
    data: data
  })
}

// 获取债务echart数据
export function getInvestmentChartData(data: any) {
  return CLRequest.post({
    url: "/investment/chart",
    data: data
  })
}
// 获取一年债务数据
export function getYearInvestmentListApi(data: any) {
  return CLRequest.post({
    url: "/investment/yearchart",
    data: data
  })
}

//

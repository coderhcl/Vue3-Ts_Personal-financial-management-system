import clRequest from "@/service"
import { IDataType } from "../../types"

// user界面获取数据
export function getPageListData(url: string, queryInfo: any) {
  return clRequest.post<IDataType>({
    url: url,
    data: queryInfo
  })
}

// 添加新用户
export function addUserData(account: any) {
  return clRequest.post<IDataType>({
    url: "/addUser",
    data: account,
    showLoading: false
  })
}

// 删除用户
export function deleteUser(id: string) {
  return clRequest.delete({
    url: `/deleteUser/` + id
  })
}
// 通过id获取用户
export function getUserDataById(id: string) {
  return clRequest.get({
    url: `/user/` + id
  })
}

// 更新用户
export function updateUser(id: string, data: any) {
  return clRequest.patch({
    url: `/patchUser/` + id,
    data: data
  })
}

// 获取收入分类数据合并在上面 getPageListData中，url:/category/list
// export function getIncomeListData() {
//   return clRequest.get<IDataType>({
//     url: "/category",
//     showLoading: true
//   })
// }

export function addIncomeCategoryData(data: any) {
  // 添加新收入分类
  return clRequest.post<IDataType>({
    url: "/income/category",
    data: data,
    showLoading: true
  })
}

// 编辑收入分类
export function updateIncomeCategory(id: string, data: any) {
  return clRequest.patch({
    url: `/income/patchCategory/` + id,
    data: data
  })
}

//删除收入分类
export function deleteIncomeCategory(id: string) {
  return clRequest.delete({
    url: `/income/deleteCategory/` + id
  })
}

// ##################支出###################

export function addExpenseCategoryData(data: any) {
  // 添加新支出分类
  return clRequest.post<IDataType>({
    url: "/expense/category",
    data: data,
    showLoading: true
  })
}

// 编辑支出分类
export function updateExpenseCategory(id: string, data: any) {
  return clRequest.patch({
    url: `/expense/patchCategory/` + id,
    data: data
  })
}

//删除支出分类
export function deleteExpenseCategory(id: string) {
  return clRequest.delete({
    url: `/expense/deleteCategory/` + id
  })
}

// ##################投资###################

export function addInvestmentCategoryData(data: any) {
  // 添加新投资分类
  return clRequest.post<IDataType>({
    url: "/investment/category",
    data: data,
    showLoading: true
  })
}

// 编辑投资分类
export function updateInvestmentCategory(id: string, data: any) {
  return clRequest.patch({
    url: `/investment/patchCategory/` + id,
    data: data
  })
}

//删除投资分类
export function deleteInvestmentCategory(id: string) {
  return clRequest.delete({
    url: `/investment/deleteCategory/` + id
  })
}

// ##################债务###################
// 添加债务
export function addDebtCategoryData(data: any) {
  // 添加新债务分类
  return clRequest.post<IDataType>({
    url: "/debt/category",
    data: data,
    showLoading: true
  })
}

// 编辑债务分类
export function updateDebtCategory(id: string, data: any) {
  return clRequest.patch({
    url: `/debt/patchCategory/` + id,
    data: data
  })
}

//删除债务分类
export function deleteDebtCategory(id: string) {
  return clRequest.delete({
    url: `/debt/deleteCategory/` + id
  })
}
// ##################公告###################
// 添加公告
export function addNoticeData(data: any) {
  // 添加新债务分类
  return clRequest.post<IDataType>({
    url: "/notice/category",
    data: data,
    showLoading: true
  })
}

// 编辑债务分类
export function updateNotice(id: string, data: any) {
  return clRequest.patch({
    url: `/debt/patchCategory/` + id,
    data: data
  })
}

//删除债务分类
export function deleteDebtCategory(id: string) {
  return clRequest.delete({
    url: `/debt/deleteCategory/` + id
  })
}

//

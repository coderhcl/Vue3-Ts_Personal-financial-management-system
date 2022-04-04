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

export function addCategoryData(data: any) {
  // 添加新分类
  return clRequest.post<IDataType>({
    url: "/category",
    data: data,
    showLoading: true
  })
}

// 编辑分类
export function updateCategory(id: string, data: any) {
  return clRequest.patch({
    url: `/patchCategory/` + id,
    data: data
  })
}

//删除分类
export function deleteCategory(id: string) {
  return clRequest.delete({
    url: `/deleteCategory/` + id
  })
}

//

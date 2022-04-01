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

export function getUserDataById(id: string) {
  return clRequest.get({
    url: `/user/` + id
  })
}

export function updateUser(id: string, data: any) {
  return clRequest.patch({
    url: `/patchUser/` + id,
    data: data
  })
}
//

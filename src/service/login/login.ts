import CLRequest from "../index"
import { IAccount, ILoginResult } from "./types"
import { IDataType } from "../types"
enum LoginApi {
  AccountLogin = "/login",
  LoginUserInfo = "/user/",
  AdminMenu = "/adminmenu",
  Menu = "/menu"
}
// 登录
export function accountLoginRequest(account: IAccount) {
  return CLRequest.post<IDataType<ILoginResult>>({
    url: LoginApi.AccountLogin,
    data: account
  })
}
// 获取用户信息
export function requestUserInfoById(id: string) {
  return CLRequest.get<IDataType<any>>({
    url: LoginApi.LoginUserInfo + id
  })
}

export function requestUserMenu(roleId: number) {
  if (roleId === 1) {
    return CLRequest.get<IDataType<ILoginResult>>({
      url: LoginApi.AdminMenu
    })
  } else if (roleId === 2) {
    return CLRequest.get<IDataType<ILoginResult>>({
      url: LoginApi.Menu
    })
  }
}
// 获取公告信息
export function requestNotice() {
  return CLRequest.get<IDataType<any>>({
    url: "/notice/isShow"
  })
}

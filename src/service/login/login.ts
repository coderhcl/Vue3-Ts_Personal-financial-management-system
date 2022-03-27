import CLRequest from "../index"
import { IAccount, IDataType, ILoginResult } from "./types"

enum LoginApi {
  AccountLogin = "/login",
  LoginUserInfo = "/user/"
}

export function accountLoginRequest(account: IAccount) {
  return CLRequest.post<IDataType<ILoginResult>>({
    url: LoginApi.AccountLogin,
    data: account
  })
}

export function requestUserInfoById(id: string) {
  return CLRequest.get({
    url: LoginApi.LoginUserInfo + id
  })
}

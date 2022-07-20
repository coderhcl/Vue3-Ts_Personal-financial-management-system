import CLRequest from "../index"
import { ICheck, IForget, IForgetResult } from "./types"
import { IDataType } from "../types"

export function forgetPassword(account: IForget) {
  return CLRequest.get<IDataType<IForgetResult>>({
    url: "/forget",
    params: account
    // showLoading: true
  })
}

export function checkPassword(account: ICheck) {
  return CLRequest.patch<IDataType<IForgetResult>>({
    url: "/patchpasswords",
    data: account
  })
}

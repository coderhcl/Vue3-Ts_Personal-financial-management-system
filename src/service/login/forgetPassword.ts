import CLRequest from "../index"
import { ICheck, IDataType, IForget, IForgetResult } from "./types"

export function forgetPassword(account: IForget) {
  return CLRequest.get<IDataType<IForgetResult>>({
    url: "/forget",
    params: account,
    showLoading: true
  })
}

export function checkPassword(account: ICheck) {
  return CLRequest.patch<IDataType<IForgetResult>>({
    url: "/patchpasswords",
    data: account,
    showLoading: true
  })
}

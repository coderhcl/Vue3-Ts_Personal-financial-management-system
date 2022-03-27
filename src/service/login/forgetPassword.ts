import CLRequest from "../index"
import { IDataType, IForget, IForgetResult } from "./types"

export function forgetPassword(account: IForget) {
  return CLRequest.get<IDataType<IForgetResult>>({
    url: "/forget",
    params: account,
    showLoading: true
  })
}

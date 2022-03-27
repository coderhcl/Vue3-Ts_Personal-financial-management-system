import CLRequest from "../index"
import { IDataType, IRegi, IRegiResult } from "./types"

export function accountRegiRequest(account: IRegi) {
  return CLRequest.post<IDataType<IRegiResult>>({
    url: "/registration",
    data: account,
    showLoading: false
  })
}

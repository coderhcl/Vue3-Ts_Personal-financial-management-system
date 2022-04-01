import CLRequest from "../index"
import { IRegi, IRegiResult } from "./types"
import { IDataType } from "../types"

export function accountRegiRequest(account: IRegi) {
  return CLRequest.post<IDataType<IRegiResult>>({
    url: "/registration",
    data: account,
    showLoading: false
  })
}

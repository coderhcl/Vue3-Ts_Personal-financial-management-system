import CLRequest from "@/service"
import { IDataType } from "../../types"

// 获取用户数量
export function getUserNumApi() {
  return CLRequest.get<IDataType<any>>({
    url: "/home/usernum/"
  })
}

// 获取一年收入数据
export function getYearIncomeListApi(data: any) {
  return CLRequest.post({
    url: "/income/yearchart",
    data: data
  })
}
// 获取一年支出数据
export function getYearExpenseListApi(data: any) {
  return CLRequest.post({
    url: "/expense/yearchart",
    data: data
  })
}
// 获取一年债务
export function getYearDebtListApi(data: any) {
  return CLRequest.post({
    url: "/debt/yearchart",
    data: data
  })
}
export function requestUserInfoById(id: string) {
  return CLRequest.get<IDataType<any>>({
    url: "/user/" + id
  })
}
//

import CLRequest from "@/service"
import { IDataType } from "../../types"

export function requestUserInfoById(id: string) {
  return CLRequest.get<IDataType<any>>({
    url: "/user/" + id
  })
}

export function changeUserInfo(id: string, data: any) {
  return CLRequest.patch({
    url: "/patchUser/" + id,
    data: data
  })
}
//

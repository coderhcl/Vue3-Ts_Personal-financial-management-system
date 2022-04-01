import { IRootState } from "@/store/types"
import { Module } from "vuex"
import { ISystemState } from "./types"
import { getPageListData, addUserData } from "@/service/main/system/system"
import { ElMessage } from "element-plus"
import localCache from "@/utils/cache"

const systemModule: Module<ISystemState, IRootState> = {
  namespaced: true,
  state() {
    return {
      userList: [],
      userCount: 0
    }
  },
  mutations: {
    changeUserList(state, userList: any[]) {
      state.userList = userList
    },
    changeUserCount(state, userCount: number) {
      state.userCount = userCount
    }
  },
  actions: {
    async getPageListAction({ commit }, payload: any) {
      // 对页数据请求
      const pageResult = await getPageListData(
        payload.pageUrl,
        payload.queryInfo
      )
      const { list, totalCount } = pageResult.data
      commit("changeUserList", list)
      commit("changeUserCount", totalCount)
    }
    // 添加用户
    // async addUserAction({ commit }, formData: any) {
    //   const addUserResult = await addUserData(formData)
    //   if (addUserResult.code > 0) {
    //     // 注册成功，实现登录逻辑
    //     const addUserRequest = await addUserData(formData)
    //     const { message } = addUserRequest.data
    //     ElMessage({
    //       message: message,
    //       type: "success"
    //     })
    //   } else {
    //     ElMessage({
    //       message: addUserResult.data.message,
    //       type: "warning"
    //     })
    //   }
    // }
  }
}

export default systemModule
//

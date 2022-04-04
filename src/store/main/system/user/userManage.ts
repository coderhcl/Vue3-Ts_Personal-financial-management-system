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
  }
}

export default systemModule
//

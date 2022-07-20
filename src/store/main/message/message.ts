import { IRootState } from "@/store/types"
import { Module } from "vuex"
import { IMessageState } from "./types"
import { ElNotification } from "element-plus"
import localCache from "@/utils/cache"
import { changeUserInfo } from "@/service/main/message/message"

const messageModule: Module<IMessageState, IRootState> = {
  namespaced: true,
  state() {
    return {
      userList: []
    }
  },
  mutations: {
    changeUserList(state, userList: any[]) {
      state.userList = userList
    }
  },
  actions: {
    async changeUserInfoAction({ commit }, payload: any) {
      const result = await changeUserInfo(payload.id, { ...payload.userInfo })
      if (result.code > 0) {
        const user = result.data.user
        commit("changeUserList", user)
        localCache.setCache("changeUser", user)
        ElNotification({
          title: "Success",
          message: result.data.message,
          type: "success"
        })
      } else {
        ElNotification({
          title: "Warning",
          message: result.data.message,
          type: "warning"
        })
      }
    },
    // 刷新的时候保存
    loadLocalMessage({ commit }) {
      const user = localCache.getCache("changeUser")
      if (user) {
        commit("changeUserList", user)
      }
    }
  }
}

export default messageModule
//

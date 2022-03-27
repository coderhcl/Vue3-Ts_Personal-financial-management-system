import { Module } from "vuex"
import { ILoginState } from "./types"
import { IRootState } from "../types"
import { accountLoginRequest, requestUserInfoById } from "@/service/login/login"
import { IAccount } from "@/service/login/types"
import { ElMessage } from "element-plus"
import router from "@/router"
import localCache from "@/utils/cache"

const loginModule: Module<ILoginState, IRootState> = {
  namespaced: true,
  state() {
    return {
      token: "",
      userInfo: {}
    }
  },
  getters: {},
  mutations: {
    changeToken: (state, token: string) => {
      state.token = token
    }
  },
  actions: {
    // 实现登录逻辑
    async accountLoginAction({ commit }, payload: IAccount) {
      const loginRequest = await accountLoginRequest(payload)
      const { _id, token, message } = loginRequest.data

      if (loginRequest.code > 0) {
        commit("changeToken", token)
        localCache.setCache("token", token)
        // 请求用户信息
        const userInfoRequest = await requestUserInfoById(_id)
        // console.log(userInfoRequest)
        ElMessage({
          message: message,
          type: "success"
        })
        router.push("/main")
      } else {
        ElMessage({
          message: message,
          type: "warning"
        })
      }
    },
    // 刷新的时候保存用户数据和菜单数据
    loadLocalLogin({ commit }) {
      const token = localCache.getCache("token")
      if (token) {
        commit("changeToken", token)
      }
    }
  }
}

export default loginModule

import { Module } from "vuex"
import { ILoginState } from "./types"
import { IRootState } from "../types"
import {
  accountLoginRequest,
  requestNotice,
  requestUserInfoById,
  requestUserMenu
} from "@/service/login/login"
import { IAccount, IRegi } from "@/service/login/types"
import { ElMessage, ElNotification } from "element-plus"
import router from "@/router"
import localCache from "@/utils/cache"
import { mapMenusToRoutes } from "@/utils/map-menus"
import { accountRegiRequest } from "@/service/login/registration"
import { getIncomeChartData } from "@/service/main/property/property"
import { ref } from "vue"

const loginModule: Module<ILoginState, IRootState> = {
  namespaced: true,
  state() {
    return {
      token: "",
      userInfo: {},
      roleId: 2,
      userMenus: [],
      notice: ""
    }
  },
  getters: {},
  mutations: {
    changeToken: (state, token: string) => {
      state.token = token
    },
    changeUserInfo: (state, userInfo: any) => {
      state.userInfo = userInfo
    },
    changeNotice: (state, notice: any) => {
      state.notice = notice
    },
    changeRoleId: (state, roleId: number) => {
      state.roleId = roleId
    },
    changeUserMenus(state, userMenus: any) {
      state.userMenus = userMenus
      // userMenu => routes
      const menus = userMenus.menus
      const routes = mapMenusToRoutes(menus)

      // 将routes => router.main.children
      // 注册menu中存在url符合的路由
      routes.forEach((route) => {
        router.addRoute("main", route)
      })
    }
  },
  actions: {
    // 1.实现登录逻辑
    async accountLoginAction({ commit }, payload: IAccount) {
      const loginRequest = await accountLoginRequest(payload)
      const { _id, token, message, roleId } = loginRequest.data

      if (loginRequest.code > 0) {
        // 获取当前登录时间
        const loginDay = new Date().toLocaleString()
        localCache.setCache("loginDay", loginDay)
        commit("changeToken", token)
        localCache.setCache("token", token)
        // 2.请求用户信息
        const userInfo = await requestUserInfoById(_id)
        localCache.setCache(`${userInfo.data.user.name}+loginDay`, loginDay)
        commit("changeUserInfo", userInfo)
        localCache.setCache("userInfo", userInfo)
        const notice = await requestNotice()
        commit("changeNotice", notice)
        localCache.setCache("notice", notice)

        // 3.请求菜单
        const userMenusResult = await requestUserMenu(roleId)

        if (userMenusResult!.code > 0) {
          const userMenus = userMenusResult!.data

          commit("changeUserMenus", userMenus)
          localCache.setCache("userMenus", userMenus)
        }
        ElNotification({
          title: "Success",
          message: message,
          type: "success"
        })

        router.push("/main/home/show")
      } else {
        ElNotification({
          title: "Warning",
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
      const userInfo = localCache.getCache("userInfo")
      if (userInfo) {
        commit("changeUserInfo", userInfo)
      }
      const userMenus = localCache.getCache("userMenus")
      if (userMenus) {
        commit("changeUserMenus", userMenus)
      }
      const notice = localCache.getCache("notice")
      if (notice) {
        commit("changeNotice", notice)
      }
    },
    // 注册逻辑
    async accountRegiAction({ commit }, payload: IRegi) {
      const loginInfo = { name: "", password: "" }
      loginInfo.name = payload.name
      loginInfo.password = payload.password
      const regiResult = await accountRegiRequest(payload)
      if (regiResult.code < 0) {
        ElNotification({
          title: "Warning",
          message: regiResult.data.message,
          type: "warning"
        })
      } else {
        // 注册成功，实现登录逻辑
        const loginRequest = await accountLoginRequest(loginInfo)
        // console.log(loginRequest)
        const { _id, token, message, roleId } = loginRequest.data

        if (loginRequest.code > 0) {
          commit("changeToken", token)
          localCache.setCache("token", token)

          // 2.请求用户信息
          const userInfo = await requestUserInfoById(_id)
          commit("changeUserInfo", userInfo)
          localCache.setCache("userInfo", userInfo)
          // 3.请求菜单
          const userMenusResult = await requestUserMenu(roleId)
          if (userMenusResult!.code > 0) {
            const userMenu = userMenusResult!.data
            commit("changeUserMenus", userMenu)
            localCache.setCache("userMenus", userMenu)
          }
          ElNotification({
            title: "Success",
            message: message,
            type: "success"
          })

          router.push("/main")
        } else {
          ElNotification({
            title: "Warning",
            message: message,
            type: "warning"
          })
        }
        ElNotification({
          title: "Warning",
          message: regiResult.data.message,
          type: "success"
        })

        router.push("/main")
      }
    }
  }
}

export default loginModule

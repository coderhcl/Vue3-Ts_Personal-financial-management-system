import { accountRegiRequest } from "@/service/login/registration"
import { IRegi } from "@/service/login/types"
import { Module } from "vuex"
import { IRootState } from "../types"
import { IRegiState } from "./types"
import router from "@/router"
import { ElMessage } from "element-plus"
import {
  accountLoginRequest,
  requestUserInfoById,
  requestUserMenu
} from "@/service/login/login"
import localCache from "@/utils/cache"
import { mapMenusToRoutes } from "@/utils/map-menus"

const registrationsModule: Module<IRegiState, IRootState> = {
  namespaced: true,
  state() {
    return {
      name: "",
      password: "",
      phone: 0,
      email: "",
      select: "",
      token: "",
      userInfo: {},
      roleId: 2,
      userMenus: []
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
    // 实现注册逻辑
    async accountRegiAction({ commit }, payload: IRegi) {
      const regiResult = await accountRegiRequest(payload)
      if (regiResult.code < 0) {
        ElMessage({
          message: regiResult.data.message,
          type: "warning"
        })
      } else {
        // 注册成功，实现登录逻辑
        const loginRequest = await accountLoginRequest(payload)
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
            const userMenus = userMenusResult!.data
            // console.log(userMenus)

            commit("changeUserMenus", userMenus)
            localCache.setCache("userMenus", userMenus)
          }
          ElMessage({
            message: message,
            type: "success"
          })
          router.push("/main/home/show")
        } else {
          ElMessage({
            message: message,
            type: "warning"
          })
        }
        ElMessage({
          message: regiResult.data.message,
          type: "success"
        })
        router.push("/main/home/show")
      }
    }
  }
}
export default registrationsModule

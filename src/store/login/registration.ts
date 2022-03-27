import { accountRegiRequest } from "@/service/login/registration"
import { IRegi } from "@/service/login/types"
import { Module } from "vuex"
import { IRootState } from "../types"
import { IRegiState } from "./types"
import router from "@/router"
import { ElMessage } from "element-plus"
const registrationsModule: Module<IRegiState, IRootState> = {
  namespaced: true,
  state() {
    return {
      name: "",
      password: "",
      phone: 0,
      email: "",
      select: ""
    }
  },
  getters: {},
  mutations: {},
  actions: {
    // 实现注册逻辑
    async accountRegiAction({ commit }, payload: IRegi) {
      const regiResult = await accountRegiRequest(payload)
      console.log(regiResult)
      if (regiResult.code < 0) {
        ElMessage({
          message: regiResult.data.message,
          type: "warning"
        })
      } else {
        ElMessage({
          message: regiResult.data.message,
          type: "success"
        })
        router.push("/main")
      }
    }
  }
}
export default registrationsModule

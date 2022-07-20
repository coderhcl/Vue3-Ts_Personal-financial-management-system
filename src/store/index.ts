import { createStore, Store, useStore as useVuexStore } from "vuex"
import login from "./login/login"
// import registration from "./login/registration"
import { IRootState, IStoreType } from "./types"
import system from "./main/system/user/userManage"
import message from "./main/message/message"
const store = createStore<IRootState>({
  state: () => {
    return {
      name: "hcl",
      age: 18
    }
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    login,
    system,
    message
  }
})

export function setupStore() {
  store.dispatch("login/loadLocalLogin")
  store.dispatch("message/loadLocalMessage")
}

export function useStore(): Store<IStoreType> {
  return useVuexStore()
}
export default store

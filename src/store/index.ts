import { createStore, Store, useStore as useVuexStore } from "vuex"
import login from "./login/login"
import registration from "./login/registration"
import { IRootState, IStoreType } from "./types"

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
    registration
  }
})

export function setupStore() {
  store.dispatch("login/loadLocalLogin")
}

export function useStore(): Store<IStoreType> {
  return useVuexStore()
}
export default store

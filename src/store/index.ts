import { createStore } from "vuex"
import login from "./login/login"
import registration from "./login/registration"
import { IRootState } from "./types"

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

export default store

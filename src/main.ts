import { createApp } from "vue"
import ElementPlus from "element-plus"
import * as ElIcons from "@element-plus/icons-vue"
import "element-plus/dist/index.css"
import "normalize.css"
import "./assets/css/index.less"
import "animate.css/animate.min.css"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import { setupStore } from "./store"
const app = createApp(App)
for (const name in ElIcons) {
  app.component(name, (ElIcons as any)[name])
}
app.use(store)
app.use(ElementPlus)
setupStore()
app.use(router)
app.mount("#app")
// git add .
// npm run commit
// git remote add origin git@github.com:coderhcl/Vue3-TS-Personal-financial-management-system.git
// git remote add origin git@github.com:coderhcl/Node-Api-Personal-financial-management-system.git
// git branch -M main
// git push -u origin main

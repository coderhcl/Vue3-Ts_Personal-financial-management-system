import { createApp } from "vue"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import "normalize.css"
import "./assets/css/index.less"
import clRequest from "./service"

import App from "./App.vue"
import router from "./router"
import store from "./store"
import { setupStore } from "./store"

const app = createApp(App)
app.use(store)
app.use(router)
setupStore()
app.use(ElementPlus)
app.mount("#app")

// type DataType = {
//   data: any
//   returnCode: string
//   success: string
// }
// clRequest
//   .get<DataType>({
//     url: "/home/multidata",
//     showLoading: false
//   })
//   .then((res) => {
//     console.log(res.data)
//     console.log(res.returnCode)
//     console.log(res.success)
//   })

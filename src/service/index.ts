// service统一出口
import CLRequest from "./request/index"
import { BASE_URL, TIME_OUT } from "./request/config"
import localCache from "@/utils/cache"

const clRequest = new CLRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: (config) => {
      // 携带token的拦截
      const token = localCache.getCache("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    requestInterceptorCath: (err) => {
      // console.log("请求失败的拦截")

      return err
    },
    responseInterceptor: (res) => {
      // console.log("响应成功的拦截")

      return res
    },
    responseInterceptorCath: (err) => {
      // console.log("响应失败的拦截")

      return err
    }
  }
})

export default clRequest

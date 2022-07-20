import axios from "axios"
import type { AxiosInstance } from "axios"
import type { CLRequestInterceptors, CLRequestConfig } from "./type"
import { ElLoading } from "element-plus"
import { LoadingInstance } from "element-plus/lib/components/loading/src/loading"

const DEFAULT_LOADING = false

class CLRequest {
  // 如果有多个实例，可以创建放在instance这边
  instance: AxiosInstance
  // 外面传的拦截器
  interceptors?: CLRequestInterceptors
  showLoading: boolean
  loading?: LoadingInstance

  // 构造函数
  constructor(config: CLRequestConfig) {
    this.instance = axios.create(config)
    this.interceptors = config.interceptors
    this.showLoading = config.showLoading ?? DEFAULT_LOADING
    // 把外面(new一个对象)传过来的拦截器函数进行使用
    // 从config中取出的拦截器就是对应的实例的拦截器
    // 1、new对象拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCath
    )
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCath
    )
    ///2、添加所有实例都有的拦截器
    this.instance.interceptors.request.use(
      (config) => {
        if (this.showLoading) {
          // 添加loading
          this.loading = ElLoading.service({
            lock: true,
            text: "正在请求数据....",
            background: "rgba(0,0,0,0.5)"
          })
        }

        // console.log("所有的实例都有的拦截器，请求拦截成功")
        return config
      },
      (err) => {
        // console.log("所有的实例都有的拦截器，请求拦截失败")
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        this.loading?.close()

        // console.log("所有的实例都有的拦截器，响应拦截成功")
        return res.data
      },
      (err) => {
        this.loading?.close()
        // console.log("所有的实例都有的拦截器，响应拦截失败")

        return err
      }
    )
  }
  // 自定义封装函数 request(config) 接收外面传来的参数config，
  // 3、封装函数也可以有拦截器
  // this.instance实例对象和 axios一样
  request<T = any>(config: CLRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 1单个请求对config的处理
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }
      // 2判断是否需要显示loading
      if (config.showLoading === false) {
        this.showLoading = config.showLoading
      }

      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单个请求对数据的处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }
          // 将showloading设置为true 这样不会影响下一个请求
          this.showLoading = DEFAULT_LOADING
          resolve(res)
        })
        .catch((err) => {
          this.showLoading = DEFAULT_LOADING
          reject(err)
          return err
        })
    })
  }

  get<T = any>(config: CLRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "GET" })
  }

  post<T = any>(config: CLRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "POST" })
  }
  delete<T = any>(config: CLRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE" })
  }
  patch<T = any>(config: CLRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "PATCH" })
  }
}

export default CLRequest

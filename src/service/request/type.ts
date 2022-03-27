import type { AxiosRequestConfig, AxiosResponse } from "axios"

// 拦截器 Interceptors 接口
export interface CLRequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: any) => AxiosRequestConfig
  requestInterceptorCath?: (error: any) => any
  responseInterceptor?: (res: T) => T
  responseInterceptorCath?: (error: any) => any
}

// 扩展类型 CLRequestConfig 比原来 AxiosRequestConfig扩展了interceptors
export interface CLRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: CLRequestInterceptors<T>
  showLoading?: boolean
}

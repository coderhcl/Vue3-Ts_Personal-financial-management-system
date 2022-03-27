// 接口传入的参数
export interface IAccount {
  name: string
  password: string
}
export interface ILoginResult {
  _id: string
  id: number
  name: string
  token: string
  message: string
}

export interface IDataType<T = any> {
  code: number
  data: T
}
// 注册
export interface IRegi {
  name: string
  password: string
  phone: number
  email: string
}
export interface IRegiResult {
  message: string
}

export interface IForgetResult {
  message: string
}

export interface IForget {
  name: string
  phone: string
  email: string
}

import { ILoginState, IRegiState } from "./login/types"
import { ISystemState } from "./main/system/user/types"

export interface IRootState {
  name: string
  age: number
}

export interface IRootWithModule {
  login: ILoginState
  registration: IRegiState
  system: ISystemState
  message: any
}

export type IStoreType = IRootState & IRootWithModule

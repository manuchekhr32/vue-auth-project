export interface IRegisterPayload {
  username: string
  password: string
  fullName: string
  website?: string | null
  about?: string | null
}

export type TLoginPayload = Pick<IRegisterPayload, 'username' | 'password'>

export interface IAuthTokens {
  accessToken: string | null
  refreshToken: string | null
}

export interface IAuthUser {
  id: number
  username: string
  about: null | string
  fullName: string
  website: null | string
  updatedAt: string | Date
  createdAt: string | Date
}

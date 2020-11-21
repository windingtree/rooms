enum IProfileRoleEnum {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MANAGER = 'MANAGER',
  OWNER = 'OWNER',
  OBSERVER = 'OBSERVER',
}

interface IProfileRole {
  SUPER_ADMIN: 'SUPER_ADMIN'
  MANAGER: 'MANAGER'
  OWNER: 'OWNER'
  OBSERVER: 'OBSERVER'
}

interface IBaseProfile {
  email: string
  name: string
  phone: string
  oneTimePassword: string
  sessionToken: string
  role: keyof IProfileRole
  hotelId: string
}

interface IProfileAuthData {
  email: string
  oneTimePassword: string
  sessionToken: string
}

interface IProfile extends IBaseProfile {
  id: string
}

type IProfileCollection = Array<IProfile>

interface IPostProfilePayload {
  email: string
  name?: string
  phone?: string
  role: keyof IProfileRole
}

interface IPatchProfilePayload {
  name?: string
  phone?: string
}

interface IUpdateProfileData {
  email?: string
  name?: string
  phone?: string
  oneTimePassword?: string
  sessionToken?: string
  role?: string
  hotelId?: string
}

export {
  IBaseProfile,
  IProfileAuthData,
  IProfile,
  IProfileCollection,
  IPostProfilePayload,
  IPatchProfilePayload,
  IUpdateProfileData,
  IProfileRoleEnum,
  IProfileRole,
}

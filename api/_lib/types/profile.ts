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

interface IOneTimePasswordPayload {
  email: string
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
  oneTimePassword?: string
  sessionToken?: string
  role: keyof IProfileRole
  hotelId?: string
}

interface IPatchProfilePayload {
  email?: string
  name?: string
  phone?: string
  oneTimePassword?: string
  sessionToken?: string
  role?: keyof IProfileRole
  hotelId?: string
}

interface IProfileDbRecord extends IBaseProfile {
  _id: string
}

type IProfileDbRecordCollection = Array<IProfileDbRecord>

export {
  IBaseProfile,
  IProfileAuthData,
  IOneTimePasswordPayload,
  IProfile,
  IProfileCollection,
  IPostProfilePayload,
  IPatchProfilePayload,
  IProfileRoleEnum,
  IProfileRole,
  IProfileDbRecord,
  IProfileDbRecordCollection,
}

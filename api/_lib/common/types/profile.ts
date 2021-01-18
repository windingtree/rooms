import { ObjectID } from 'mongodb'

type TProfileDbDataFields =
  | '_id'
  | 'email'
  | 'name'
  | 'phone'
  | 'oneTimePassword'
  | 'sessionToken'
  | 'role'
  | 'hotelId'

type IProfileDbDataProjection = {
  [key in TProfileDbDataFields]?: 1
}

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

interface IBaseProfileDbData {
  email: string
  name: string
  phone: string
  oneTimePassword: string
  sessionToken: string
  role: keyof IProfileRole
  hotelId: ObjectID|null
}

interface IProfileDbData extends IBaseProfileDbData {
  _id: ObjectID|null
}

interface IPatchProfilePayloadDbData {
  email?: string
  name?: string
  phone?: string
  oneTimePassword?: string
  sessionToken?: string
  role?: keyof IProfileRole
  hotelId?: ObjectID|null
}

type IProfileCollectionDbData = Array<IProfileDbData>

export {
  TProfileDbDataFields,
  IProfileDbDataProjection,
  IBaseProfile,
  IProfileAuthData,
  IOneTimePasswordPayload,
  IProfile,
  IProfileCollection,
  IPostProfilePayload,
  IPatchProfilePayload,
  IProfileRoleEnum,
  IProfileRole,
  IBaseProfileDbData,
  IProfileDbData,
  IPatchProfilePayloadDbData,
  IProfileCollectionDbData,
}

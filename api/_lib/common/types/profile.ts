import { ObjectID } from 'mongodb'

type TProfileDbDataFields =
  | '_id'
  | 'email'
  | 'name'
  | 'phone'
  | 'oneTimePassword'
  | 'sessionToken'
  | 'role'

type IProfileDbDataProjection = {
  [key in TProfileDbDataFields]?: 1
}

enum IProfileRoleEnum {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SUPPORT_SUPERVISOR = 'SUPPORT_SUPERVISOR',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  CLERK = 'CLERK',
}

interface IProfileRole {
  SUPER_ADMIN: 'SUPER_ADMIN'
  SUPPORT_SUPERVISOR: 'SUPPORT_SUPERVISOR'
  SUPPORT_AGENT: 'SUPPORT_AGENT'
  OWNER: 'OWNER'
  MANAGER: 'MANAGER'
  CLERK: 'CLERK'
}

interface IBaseProfile {
  email: string
  name: string
  phone: string
  oneTimePassword: string
  sessionToken: string
  role: keyof IProfileRole
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
}

interface IPatchProfilePayload {
  email?: string
  name?: string
  phone?: string
  oneTimePassword?: string
  sessionToken?: string
  role?: keyof IProfileRole
}

interface IBaseProfileDbData {
  email: string
  name: string
  phone: string
  oneTimePassword: string
  sessionToken: string
  role: keyof IProfileRole
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

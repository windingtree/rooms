interface IBaseProfile {
  email: string
  name: string
  phone: string
  oneTimePassword: string
  sessionToken: string
  role: string
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
  role: string
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

interface IProfileRole {
  SUPER_ADMIN: string
  MANAGER: string
  OWNER: string
  OBSERVER: string
}

export {
  IBaseProfile,
  IProfileAuthData,
  IProfile,
  IProfileCollection,
  IPostProfilePayload,
  IPatchProfilePayload,
  IUpdateProfileData,
  IProfileRole,
}

interface IBaseProfile {
  email: string
  name: string
  phone: string
  oneTimePassword: string
  sessionToken: string
  role: string
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
}

export {
  IBaseProfile,
  IProfile,
  IProfileCollection,
  IPostProfilePayload,
  IPatchProfilePayload,
  IUpdateProfileData,
}

interface IBaseProfile {
  email: string
  oneTimePassword: string
  sessionToken: string
  role: string
}

interface IProfile extends IBaseProfile {
  id: string
}

type IProfileCollection = Array<IProfile>

interface IUpdateProfileData {
  email?: string
  oneTimePassword?: string
  sessionToken?: string
}

export {
  IBaseProfile,
  IProfile,
  IProfileCollection,
  IUpdateProfileData,
}

import { disableApiRequestsHere } from '../tools'

export default disableApiRequestsHere

/* --------------- internal API methods/structure below --------------- */

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
  id: string

  email?: string
  oneTimePassword?: string
  sessionToken?: string
  role?: string
}

export {
  IBaseProfile
  IProfile,
  IProfileCollection,
  IUpdateProfileData,
}

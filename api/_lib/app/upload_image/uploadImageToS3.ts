import Jimp from 'jimp'
import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

import { AppConfig } from '../../app/config'

import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import { IProfile, IPostUploadImagePayload, IUploadImage } from '../../common/types'

const { BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

async function uploadImageToS3(requester: IProfile, payload: IPostUploadImagePayload): Promise<IUploadImage> {
  const imageFile = await Jimp.read(Buffer.from(payload.file, 'base64'))
  await imageFile.resize(Jimp.AUTO, 600)

  const appConfig = await AppConfig.getInstance().getConfig()

  const s3bucket = new AWS.S3({
    accessKeyId: appConfig.AWS_ACCESS_KEY_ID,
    secretAccessKey: appConfig.AWS_SECRET_ACCESS_KEY,
    region: appConfig.AWS_REGION,
  })

  const s3FileHash = uuidv4()
  const s3FileURL = `https://s3-${appConfig.AWS_REGION}.amazonaws.com/${appConfig.AWS_BUCKET_NAME}/${s3FileHash}`

  const params = {
    Bucket: appConfig.AWS_BUCKET_NAME,
    Key: s3FileHash,
    Body: imageFile,
    ContentType: imageFile.getMIME(),
    ACL: 'public-read'
  }

  console.log('PARAMS', params);

  try {
    await s3bucket.upload(params, async (err: unknown) => {
      if (err) {
        throw new CError(BAD_GATEWAY, `Something bad happened while uploading image to S3.`, err)
      }
    });
  } catch (err: unknown) {
    throw new CError(BAD_GATEWAY, `Could not upload image to S3.`, err)
  }

  return { imageUrl: s3FileURL }
}

export { uploadImageToS3 }

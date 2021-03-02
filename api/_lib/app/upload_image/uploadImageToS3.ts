import Jimp from 'jimp'
import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

import { AppConfig } from '../../app/config'

import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'
import { IProfile, IPostUploadImagePayload, IUploadImage } from '../../common/types'

const { BAD_GATEWAY } = CONSTANTS.HTTP_STATUS

function uploadToS3Handler(s3bucket: AWS.S3, params: AWS.S3.PutObjectRequest): Promise<string> {
  let resolve: (fileUrl: string) => void
  let reject: (err: unknown) => void

  const promise = new Promise<string>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  s3bucket.upload(params, async (err: unknown, data: AWS.S3.ManagedUpload.SendData) => {
    if (err) {
      console.log('s3bucket.upload() error:')
      console.log(err)

      reject(err)
    }

    console.log(`File uploaded successfully. S3 file is located at: '${data.Location}'.`);

    resolve(data.Location)
  });

  return promise
}

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

  const params = {
    Bucket: appConfig.AWS_BUCKET_NAME,
    Key: s3FileHash,
    Body: await imageFile.getBufferAsync(imageFile.getMIME()),
    ContentType: imageFile.getMIME(),
    ACL: 'public-read'
  }

  let s3FileURL = ''
  try {
    s3FileURL = await uploadToS3Handler(s3bucket, params)
  } catch (err: unknown) {
    throw new CError(BAD_GATEWAY, `Could not upload image to S3.`, err)
  }

  return { imageUrl: s3FileURL }
}

export { uploadImageToS3 }

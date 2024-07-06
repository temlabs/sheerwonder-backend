import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getAvatarUploadUrl(client: S3Client, userId: number) {
  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_AVATAR_BUCKET_NAME,
    Key: `user-${userId.toString()}`,
  };
  const command = new PutObjectCommand(params);
  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 3600,
  });

  return signedUrl;
}

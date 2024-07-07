"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvatarUploadUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
async function getAvatarUploadUrl(client, userId) {
    const params = {
        Bucket: process.env.AWS_AVATAR_BUCKET_NAME,
        Key: `user-${userId.toString()}`,
    };
    const command = new client_s3_1.PutObjectCommand(params);
    const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(client, command, {
        expiresIn: 3600,
    });
    return signedUrl;
}
exports.getAvatarUploadUrl = getAvatarUploadUrl;

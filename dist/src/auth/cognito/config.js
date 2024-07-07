"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cognitoConfig = void 0;
exports.cognitoConfig = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
};

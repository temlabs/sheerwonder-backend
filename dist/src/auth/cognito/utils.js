"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSecretHash = exports.getCognitoError = void 0;
const crypto_1 = __importDefault(require("crypto"));
const isCognitoError = (error, errorNames) => {
    return errorNames.includes(error.name);
};
const getCognitoError = (error, errorNames, errorMap) => {
    var _a;
    if (error instanceof Error &&
        isCognitoError(error, errorNames)) {
        const errorName = error.name;
        return ((_a = errorMap[errorName]) !== null && _a !== void 0 ? _a : {
            message: "Something went wrong, please try again",
            code: 500,
            internalCode: "Error",
        });
    }
};
exports.getCognitoError = getCognitoError;
function calculateSecretHash(username, clientId, clientSecret) {
    return crypto_1.default
        .createHmac("SHA256", clientSecret)
        .update(username + clientId)
        .digest("base64");
}
exports.calculateSecretHash = calculateSecretHash;

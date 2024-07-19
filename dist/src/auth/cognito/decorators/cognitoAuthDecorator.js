"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
function getKey(header, callback) {
    const client = (0, jwks_rsa_1.default)({
        jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_USER_POOL_ID}/.well-known/jwks.json`,
    });
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key === null || key === void 0 ? void 0 : key.getPublicKey();
        callback(err, signingKey);
    });
}
exports.default = () => async (request, reply) => {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("No token provided");
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = await new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, getKey, {
                issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_USER_POOL_ID}`,
                // audience: process.env.AWS_CLIENT_ID,
            }, (err, decoded) => {
                if (err)
                    reject(err);
                else
                    resolve(decoded);
            });
        });
        request.user = {
            sub: decodedToken.sub,
            email: decodedToken.email,
            // Add any other claims you need from the token
        };
    }
    catch (error) {
        console.debug({ error });
        reply.code(401).send({ error: "Authentication failed" });
    }
};

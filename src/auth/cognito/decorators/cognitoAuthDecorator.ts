import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

interface AuthenticatedRequest extends FastifyRequest {
  user: { sub: string; email: string };
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: () => (
      request: AuthenticatedRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  const client = jwksClient({
    jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_USER_POOL_ID}/.well-known/jwks.json`,
  });
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
}

export default () =>
  async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No token provided");
      }

      const token = authHeader.split(" ")[1];

      const decodedToken: any = await new Promise((resolve, reject) => {
        jwt.verify(
          token,
          getKey,
          {
            issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_USER_POOL_ID}`,
            // audience: process.env.AWS_CLIENT_ID,
          },
          (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
          }
        );
      });

      request.user = {
        sub: decodedToken.sub,
        email: decodedToken.email,
        // Add any other claims you need from the token
      };
    } catch (error) {
      console.debug({ error });
      reply
        .code(401)
        .send({
          error: {
            message: "Authentication failed",
            internalCode: "AuthFail",
            code: "AuthFail",
          },
        });
    }
  };

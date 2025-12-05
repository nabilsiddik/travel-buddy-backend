import type { Secret, SignOptions } from "jsonwebtoken";
import type { JWTPayload } from "../interfaces";
export declare const generateJwtToken: (payload: JWTPayload, secret: Secret, expiresIn?: SignOptions["expiresIn"]) => string;
export declare const verifyToken: (token: string, secret: Secret) => JWTPayload;
//# sourceMappingURL=jwtToken.d.ts.map
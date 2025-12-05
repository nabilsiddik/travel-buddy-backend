import type { NextFunction, Request, Response } from "express";
import type { JWTPayload } from "../interfaces/index.js";
export declare const checkAuth: (...roles: string[]) => (req: Request & {
    user?: JWTPayload;
}, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=checkAuth.d.ts.map
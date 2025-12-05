import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";
declare const validateRequest: (zodSchema: ZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default validateRequest;
//# sourceMappingURL=validateRequest.d.ts.map
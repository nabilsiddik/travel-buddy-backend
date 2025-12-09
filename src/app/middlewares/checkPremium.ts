import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config/prisma.config";


export const checkPremium = async (req: Request & {user?: JwtPayload}, res: Response, next: NextFunction) => {
  const userId = req?.user?.id;

  if(!userId){
    throw new Error('User id not found.')
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user?.verifiedBadge) return res.status(403).json({ message: 'Premium subscription required' })

  next();
};
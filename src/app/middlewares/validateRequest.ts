import type { NextFunction, Request, Response } from "express"
import type { ZodObject } from "zod"

// Validate request according to the zod schema
const validateRequest = (zodSchema: ZodObject) => async(req: Request, res: Response, next: NextFunction) => {
  try{
    let data = req.body

    if(typeof req.body?.data === 'string'){
      data = JSON.parse(req.body?.data)
    }

    await zodSchema.parseAsync(data)
    req.body = data
    
    return next()
  }catch(err: unknown){
    next(err)
  }
}

export default validateRequest
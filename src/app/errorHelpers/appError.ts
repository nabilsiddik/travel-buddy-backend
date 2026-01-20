class AppError extends Error{
    public statusCode: number
    public isOperational: boolean

    constructor(statuscode: number, message: string, stack = ''){
        super(message)
        this.statusCode = statuscode
        this.isOperational = true

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default AppError
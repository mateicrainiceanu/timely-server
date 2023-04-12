import { Request } from "express";

interface AuthUserRequest extends Request {
    user: object // or any other type
}

export {AuthUserRequest}
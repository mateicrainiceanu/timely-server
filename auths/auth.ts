import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

import { AuthUserRequest } from "../config/interfaces";

import * as dotenv from 'dotenv';
import { User } from "../models/user";
dotenv.config()

function verifyToken(req: Request, res: Response, next: NextFunction){
    
    const token = req.body.token || req.query.token;

    if (!token) {
        return res.status(403).json({err: "A token is required for authentication"});
    }
    
    const decoded = jwt.verify(token, process.env.TOKEN_KEY as string) as object

    (req as AuthUserRequest).user = decoded as User;

    return next();
}

export default verifyToken;
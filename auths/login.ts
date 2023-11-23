import jwt from "jsonwebtoken";

import md5 from "md5";

import { User } from "../models/user";
import { Request, Response, NextFunction } from "express";

import * as dotenv from 'dotenv';
dotenv.config()


const login = async (req:Request, res:Response, next:NextFunction) => {
    const {email, password} = req.body;

    const [result] = await User.findByEmail(email)

    if (result.length !== 0){
        const [user] = result;

        if (user.password === md5(password)) {
            //password is correct
            const token = jwt.sign(
                { id: user.id, email },
                process.env.TOKEN_KEY as string,
                {
                  expiresIn: "2d",
                }
            );

            const _ = await User.saveToken(user.id, token)
            
            res.status(201).json({...user, token:token});

        } else {
            //password is incorrect
            res.status(410).json({err: "password is incorrect"})
        }
        
    } else {
        res.status(409).json({err: "There is no user with this email adress."})
    }
}

export default login;
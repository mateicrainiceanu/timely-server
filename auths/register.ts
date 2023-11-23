import jwt from "jsonwebtoken";

import md5 from "md5";

import { User } from "../models/user";

import { Request, Response, NextFunction } from "express";

import * as dotenv from 'dotenv';
dotenv.config()

const register = async (req:Request, res:Response, next:NextFunction) => {
    const {email, password} = req.body    

    const [result] = await User.findByEmail(email)

    if(result.length === 0){
        //there is no user with the email adress
        //safe to proceed with creating a new account

        //saving new user
        const newuser = new User(email, md5(password))
        const [{insertId}] = await newuser.save()

        const token = jwt.sign(
            { id: insertId, email },
            process.env.TOKEN_KEY as string,
            {
              expiresIn: "2d",
            }
        );

        const _ = await User.saveToken(insertId, token)
        
        res.status(201).json({...newuser, id:insertId, token:token});

    } else {
        res.status(409).json({err: "A user with this email adress already exists. Try loging in."})
    }
} 

export default register;
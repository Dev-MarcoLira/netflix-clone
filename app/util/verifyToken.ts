import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default (req:Request, res:Response, next:Function) => {

    const authHeader = Array.isArray(req.headers.token) ? '' : req.headers.token

    if(authHeader)  {

        const token = authHeader.split(' ')[1]

        jwt.verify(token, process.env.SECRET_KEY || '', (err, user)=> {
            if(err){
                res.status(403).send('Token not valid')
            }else{
                req.body.user = user
                next()
            }
        })
    }else{
        return res.status(401).send('You are not authenticated')
    }
}
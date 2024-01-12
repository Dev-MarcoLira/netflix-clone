import { Router } from 'express'
import User from '../models/userModel.ts'
import { publicEncrypt, publicDecrypt, randomUUID } from 'crypto'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/register', async(req, res) =>{

    const newUser = new User({
        id: randomUUID(),
        fullName: req.body.fullName,
        email: req.body.email,
        password: publicEncrypt(
            process.env.SECRET_KEY || '',
            req.body.password).toString(),
    })

    try{

        const user = await newUser.save()
        res.status(201).json(user)
    }catch(err){
        res.status(500).json(err)
    }
})

router.post('/login', async(req, res)=> {
    try{

        const user = await User.findOne({ email: req.body.email })

        if(user){

            const bytes = publicDecrypt(process.env.SECRET_KEY || '', req.body.password)
            const decrypted = bytes.toString('utf8')

            if(decrypted === req.body.password){

                const accessToken = jwt.sign(
                    { id: user._id, isAdmin: user.isAdmin },
                    process.env.SECRET_KEY || '',
                    { expiresIn: '4d' }
                )

                const info = user.toObject()
                res.status(200).send({ ...info, token: accessToken })

            }else{
                res.status(401).json('Wrong e-mail or password.')
            }
        }else{
            res.status(401).json('Wrong e-mail or password.')
        }

    }catch(err){

    }
})

export default router
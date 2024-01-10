import asyncHandler from "express-async-handler";
import User from '../models/userModel.ts'

const registerUser = asyncHandler(async (req, res)=> {

    const { fullName, email, password, image } = req.body

    new Promise((resolve, reject)=> {
        resolve(async()=>{
            const userExists = await User.findOne({ email })

            if(userExists){
                reject('User already exists!')
            }

            res.status(201).json({
                fullName,
                email,
                password,
                image
            })
        })
    })
        .then(user => {
            console.log(`Resolved: ${ user }`)
        })
        .catch(error => {
            console.log(`We got an error: ${ error.message }`)
        })
})

export { registerUser }
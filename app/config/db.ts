import mongoose from 'mongoose'

export const connect = async() => {
    try{
        
        await mongoose.connect(process.env.MONGO_URI || '',{})
    }catch(err){
        console.log(err)
        process.exit(1)
        
    }
}
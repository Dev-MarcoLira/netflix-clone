import mongoose, { Connection, Mongoose } from 'mongoose'

export const connect = async() => {
    try{
        
        await mongoose.connect(process.env.MONGO_URI || '',{})
    }catch(err){
        process.emit('SIGTERM')
    }
}
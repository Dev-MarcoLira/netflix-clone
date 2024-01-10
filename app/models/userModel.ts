import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    id: {
        type: String,
        required: [ true, 'Please add id' ],
        minLength: 30
    },
    fullName: {
        type: String,
        required: [ true, 'Please add full name' ],
        maxLength: 40
    },
    email: {
        type: String,
        required: [ true, 'Please add e-mail address' ],
        unique: true,
        trim: true,
        maxLength: 50
    },
    password: {
        type: String,
        required: [ true, 'Please add password' ],
        minLength: 10
    },
    image: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    likedMovies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie"
        }
    ],
    createdAt: {
        type: Date,
        default: mongoose.now()
    }
})

export default mongoose.model('User', UserSchema)
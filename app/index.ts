import { config } from 'dotenv'
config()

import express from 'express'
import cors from 'cors'

const PORT = process.env.PORT || 3030

const app = express()
app.use(cors())
app.use(express.json())

app
    .listen(PORT)
    .on('listening', () => console.log(`Server is running on port ${ PORT }`))
    .once('SIGTERM', () => console.log('Exiting... :('))
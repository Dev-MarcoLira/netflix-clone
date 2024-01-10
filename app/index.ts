import { config } from 'dotenv'
config()

import express from 'express'
import cors from 'cors'
import { connect } from './config/db.ts'
import routes from './routes/index.ts'

const PORT = process.env.PORT || 3030

const app = express()
app.use(cors())
app.use(express.json())

routes.forEach(route => app.use(route))

connect()

app.get('/', (req, res) => {
    res.send('API is running... ')
})

app
    .listen(PORT)
    .on('listening', () => console.log(`Server is running on port ${ PORT }`))
    .on('connect', (socket)=> console.log(`Client connected: ${ socket }`))
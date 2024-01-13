import { config } from 'dotenv'
config()

import express from 'express'
import cors from 'cors'
import { connect } from './config/db.ts'
import routes from './routes/index.ts'
import bodyParser from 'body-parser'
import { resolve } from 'path'

const PORT = process.env.PORT || 3030

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

routes.forEach(route => route(app))

app.use(express.static(resolve(__dirname, './client/build')))
app.get('*', (req, res) => {
    res.sendFile(resolve(__dirname, './client/build', 'index.html'))
})

app.get('/', (req, res) => {
    res.send('API is running... ')
})

app
    .listen(PORT)
    .on('listening', () => console.log(`Server is running on port ${ PORT }`))
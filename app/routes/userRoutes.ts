import { Router } from 'express'
import { registerUser } from '../controllers/userController.ts'
const router = Router()


router
    .post('/api/users', registerUser)
    .get('/api/users', (req, res)=> res.send('Ussers route!'))

export default router
import express from 'express'
import { login, register, renewToken } from '../Controllers/authController.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/renewToken', renewToken)

export default router
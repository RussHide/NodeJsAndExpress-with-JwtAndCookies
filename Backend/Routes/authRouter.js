import express from 'express'
import { login, register, renewToken, verifySession, logout } from '../Controllers/authController.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/renewToken', renewToken)
router.post('/verifySession', verifySession)
router.post('/logout', logout)

export default router
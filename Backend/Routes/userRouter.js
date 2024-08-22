import express from 'express'
import { getUsers, addUser, editUser, deleteUser } from '../Controllers/userController.js'

const router = express.Router()

router.get('/', getUsers)
router.post('/addUser', addUser)
router.post('/editUser', editUser)
router.post('/deleteUser', deleteUser)
export default router
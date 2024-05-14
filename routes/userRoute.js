import express from "express";
import {deleteUser, login, signup} from "../controllers/auth.js"
const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)
router.post('/delete',deleteUser)

export default  router
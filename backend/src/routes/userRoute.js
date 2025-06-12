import express from "express"
import { createUser, emailVerify, login } from "../controllers/userController.js"


const router = express.Router()

router.route("/user/registration").post(createUser)
router.route("/user/:link").get(emailVerify)
router.route("/user/login").post(login)


export default router
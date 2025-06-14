import express from "express"
import { allCategorise, categoryCreate } from "../controllers/categoryController.js"
import { protectAuth } from "../midddlewares/protectauthMiddleware.js"
import { adminAuth } from "../midddlewares/adminAuthMiddleware.js"


const router = express.Router()

router.route("/category/create").post(protectAuth, adminAuth, categoryCreate)
router.route("/categorise").get(allCategorise)



export default router
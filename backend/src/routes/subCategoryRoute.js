import express from "express"
import { protectAuth } from "../midddlewares/protectauthMiddleware.js"
import { adminAuth } from "../midddlewares/adminAuthMiddleware.js"
import { allSubCategorise, subCategoryCreate } from "../controllers/subCategoryController.js"



const router = express.Router()

router.route("/subcategory/create").post(protectAuth, adminAuth, subCategoryCreate)
router.route("/subcategorise").get(allSubCategorise)



export default router
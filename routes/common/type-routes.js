import express from "express"
import { getReclamationTypes } from "../../controllers/common/type-controller.js"

const router = express.Router()

// Obtenir tous les types de réclamation
router.get("/", getReclamationTypes)

export default router


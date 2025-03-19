import express from "express"
import { registerUser, loginUser, getUserProfile } from "../controllers/auth-controller.js"
import { isAuthenticated } from "../middleware/auth-middleware.js"

const router = express.Router()

// Routes publiques
router.post("/register", registerUser)
router.post("/login", loginUser)

// Routes protégées
router.get("/profile", isAuthenticated, getUserProfile)

export default router


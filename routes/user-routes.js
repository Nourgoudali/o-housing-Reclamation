import express from "express"
import {
  registerUser,
  loginUser,
  getUserProfile,
  getResponsables,
  getStagiaires,
} from "../controllers/user-controller.js"
import { isAuthenticated } from "../middleware/auth-middleware.js"

const router = express.Router()

// Routes publiques
router.post("/register", registerUser)
router.post("/login", loginUser)

// Routes protégées
router.get("/profile", isAuthenticated, getUserProfile)
router.get("/responsables", isAuthenticated, getResponsables)
router.get("/stagiaires", isAuthenticated, getStagiaires)

export default router


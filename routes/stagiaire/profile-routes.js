import express from "express"
import {
  getStagiaireProfile,
  updateStagiaireProfile,
  changeStagiairePassword,
} from "../../controllers/stagiaire/profile-controller.js"
import { isAuthenticated, isStagiaire } from "../../middleware/auth-middleware.js"

const router = express.Router()

// Toutes les routes nécessitent l'authentification et le rôle de stagiaire
router.use(isAuthenticated, isStagiaire)

// Obtenir le profil du stagiaire
router.get("/", getStagiaireProfile)

// Mettre à jour le profil du stagiaire
router.put("/", updateStagiaireProfile)

// Changer le mot de passe du stagiaire
router.put("/password", changeStagiairePassword)

export default router


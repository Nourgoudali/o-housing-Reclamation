import express from "express"
import {
  getStagiaireReclamations,
  createStagiaireReclamation,
  getStagiaireReclamationDetails,
  cancelStagiaireReclamation,
} from "../controllers/stagiaire-controller.js"
import { isAuthenticated, isStagiaire } from "../middleware/auth-middleware.js"

const router = express.Router()

// Toutes les routes nécessitent l'authentification et le rôle de stagiaire
router.use(isAuthenticated, isStagiaire)

// Obtenir toutes les réclamations du stagiaire connecté
router.get("/reclamations", getStagiaireReclamations)

// Créer une nouvelle réclamation
router.post("/reclamations", createStagiaireReclamation)

// Obtenir les détails d'une réclamation
router.get("/reclamations/:id", getStagiaireReclamationDetails)

// Annuler une réclamation (uniquement si elle est en attente)
router.delete("/reclamations/:id", cancelStagiaireReclamation)

export default router


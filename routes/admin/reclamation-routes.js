import express from "express"
import {
  getAllReclamations,
  getReclamationById,
  updateReclamationStatus,
  updateReclamationPriority,
  assignReclamation,
  acceptReclamation,
  rejectReclamation,
} from "../../controllers/admin/reclamation-controller.js"
import { isAuthenticated, isAdmin } from "../../middleware/auth-middleware.js"

const router = express.Router()

// Toutes les routes nécessitent l'authentification et le rôle d'admin
router.use(isAuthenticated, isAdmin)

// Obtenir toutes les réclamations avec filtres
router.get("/", getAllReclamations)

// Obtenir une réclamation par ID
router.get("/:id", getReclamationById)

// Mettre à jour le statut d'une réclamation
router.patch("/:id/status", updateReclamationStatus)

// Mettre à jour la priorité d'une réclamation
router.patch("/:id/priority", updateReclamationPriority)

// Assigner une réclamation à un responsable
router.patch("/:id/assign", assignReclamation)

// Accepter une réclamation
router.patch("/:id/accept", acceptReclamation)

// Rejeter une réclamation
router.patch("/:id/reject", rejectReclamation)

export default router


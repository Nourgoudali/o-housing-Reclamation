import express from "express"
import {
  getReclamations,
  getReclamationById,
  createReclamation,
  updateReclamationStatus,
  updateReclamationPriority,
  assignReclamation,
  acceptReclamation,
  rejectReclamation,
} from "../controllers/reclamation-controller.js"
import { isAuthenticated, isAdmin, isResponsable } from "../middleware/auth-middleware.js"

const router = express.Router()

// Routes publiques
router.get("/", getReclamations)
router.get("/:id", getReclamationById)

// Routes protégées
router.post("/", isAuthenticated, createReclamation)

// Routes pour les admins et responsables
router.patch("/:id/status", isAuthenticated, updateReclamationStatus)
router.patch("/:id/priority", isAuthenticated, isAdmin, updateReclamationPriority)
router.patch("/:id/assign", isAuthenticated, isAdmin, assignReclamation)
router.patch("/:id/accept", isAuthenticated, isResponsable, acceptReclamation)
router.patch("/:id/reject", isAuthenticated, isResponsable, rejectReclamation)

export default router


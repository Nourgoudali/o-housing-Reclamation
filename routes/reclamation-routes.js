import express from "express"
import {
  getAllReclamations,
  getReclamationById,
  createReclamation,
  updateReclamationStatus,
  updateReclamationPriority,
  deleteReclamation,
} from "../controllers/reclamation-controller.js"

const router = express.Router()

// Obtenir toutes les réclamations avec filtres
router.get("/", getAllReclamations)

// Obtenir une réclamation par ID
router.get("/:id", getReclamationById)

// Créer une nouvelle réclamation
router.post("/", createReclamation)

// Mettre à jour le statut d'une réclamation
router.patch("/:id/status", updateReclamationStatus)

// Mettre à jour la priorité d'une réclamation
router.patch("/:id/priority", updateReclamationPriority)

// Supprimer une réclamation
router.delete("/:id", deleteReclamation)

export default router


import express from "express"
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getResponsables,
  getStagiaires,
} from "../../controllers/admin/user-controller.js"
import { isAuthenticated, isAdmin } from "../../middleware/auth-middleware.js"

const router = express.Router()

// Toutes les routes nécessitent l'authentification et le rôle d'admin
router.use(isAuthenticated, isAdmin)

// Obtenir tous les utilisateurs
router.get("/", getAllUsers)

// Obtenir un utilisateur par ID
router.get("/:id", getUserById)

// Créer un nouvel utilisateur
router.post("/", createUser)

// Mettre à jour un utilisateur
router.put("/:id", updateUser)

// Supprimer un utilisateur
router.delete("/:id", deleteUser)

// Obtenir tous les responsables
router.get("/role/responsables", getResponsables)

// Obtenir tous les stagiaires
router.get("/role/stagiaires", getStagiaires)

export default router


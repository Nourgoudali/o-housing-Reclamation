import express from "express"
import { upload, addAttachments, deleteAttachment } from "../../controllers/common/upload-controller.js"
import { isAuthenticated } from "../../middleware/auth-middleware.js"

const router = express.Router()

// Toutes les routes nécessitent l'authentification
router.use(isAuthenticated)

// Route pour télécharger des pièces jointes
router.post("/:reclamationId", upload.array("files", 5), addAttachments)

// Route pour supprimer une pièce jointe
router.delete("/:reclamationId/:attachmentId", deleteAttachment)

export default router


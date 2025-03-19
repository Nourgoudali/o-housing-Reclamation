import express from "express"
import { upload, addAttachments, deleteAttachment } from "../controllers/upload-controller.js"
import { isAuthenticated } from "../middleware/auth-middleware.js"

const router = express.Router()

// Route pour télécharger des pièces jointes
router.post("/:reclamationId", isAuthenticated, upload.array("files", 5), addAttachments)

// Route pour supprimer une pièce jointe
router.delete("/:reclamationId/:attachmentId", isAuthenticated, deleteAttachment)

export default router


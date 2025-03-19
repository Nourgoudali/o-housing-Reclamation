import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import Reclamation from "../models/reclamation-model.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration de stockage pour multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads")

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

// Filtre pour les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]
  const ext = path.extname(file.originalname).toLowerCase()

  if (allowedTypes.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error("Type de fichier non autorisé. Seuls PDF, JPG, JPEG, PNG, DOC et DOCX sont acceptés."))
  }
}

// Configuration de l'upload
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
})

// Ajouter des pièces jointes à une réclamation
export const addAttachments = async (req, res) => {
  try {
    const { reclamationId } = req.params

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Aucun fichier n'a été téléchargé" })
    }

    const reclamation = await Reclamation.findById(reclamationId)

    if (!reclamation) {
      // Supprimer les fichiers téléchargés si la réclamation n'existe pas
      req.files.forEach((file) => {
        fs.unlinkSync(file.path)
      })

      return res.status(404).json({ message: "Réclamation non trouvée" })
    }

    // Ajouter les fichiers à la réclamation
    const piecesJointes = req.files.map((file) => ({
      nom: file.originalname,
      chemin: file.path.replace(/\\/g, "/").split("uploads/")[1],
      dateUpload: new Date(),
    }))

    reclamation.piecesJointes = [...reclamation.piecesJointes, ...piecesJointes]
    await reclamation.save()

    res.status(200).json({
      message: "Pièces jointes ajoutées avec succès",
      piecesJointes: reclamation.piecesJointes,
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout des pièces jointes", error: error.message })
  }
}

// Supprimer une pièce jointe
export const deleteAttachment = async (req, res) => {
  try {
    const { reclamationId, attachmentId } = req.params

    const reclamation = await Reclamation.findById(reclamationId)

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" })
    }

    // Trouver la pièce jointe
    const pieceJointe = reclamation.piecesJointes.id(attachmentId)

    if (!pieceJointe) {
      return res.status(404).json({ message: "Pièce jointe non trouvée" })
    }

    // Supprimer le fichier du système de fichiers
    const filePath = path.join(__dirname, "../uploads", pieceJointe.chemin)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Supprimer la pièce jointe de la réclamation
    reclamation.piecesJointes.pull(attachmentId)
    await reclamation.save()

    res.status(200).json({ message: "Pièce jointe supprimée avec succès" })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la pièce jointe", error: error.message })
  }
}


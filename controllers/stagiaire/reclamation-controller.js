import Reclamation from "../../models/reclamation-model.js"
import User from "../../models/user-model.js"

// Obtenir les réclamations d'un stagiaire
export const getStagiaireReclamations = async (req, res) => {
  try {
    const stagiaireId = req.user._id

    const reclamations = await Reclamation.find({ stagiaire: stagiaireId }).sort({ dateCreation: -1 })

    res.status(200).json(reclamations)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des réclamations", error: error.message })
  }
}

// Créer une nouvelle réclamation par un stagiaire
export const createStagiaireReclamation = async (req, res) => {
  try {
    const { type, sujet, description, priorite } = req.body
    const stagiaireId = req.user._id

    // Récupérer les informations du stagiaire
    const stagiaire = await User.findById(stagiaireId)

    if (!stagiaire) {
      return res.status(404).json({ message: "Stagiaire non trouvé" })
    }

    const nouvelleReclamation = new Reclamation({
      stagiaire: stagiaireId,
      chambre: stagiaire.chambre,
      categorie: type,
      sujet,
      description,
      priorite: priorite || "Moyenne",
      statut: "En attente",
    })

    const reclamationSauvegardee = await nouvelleReclamation.save()

    res.status(201).json(reclamationSauvegardee)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la réclamation", error: error.message })
  }
}

// Obtenir les détails d'une réclamation d'un stagiaire
export const getStagiaireReclamationDetails = async (req, res) => {
  try {
    const { id } = req.params
    const stagiaireId = req.user._id

    const reclamation = await Reclamation.findOne({
      _id: id,
      stagiaire: stagiaireId,
    }).populate("assigneA", "nom prenom")

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" })
    }

    res.status(200).json(reclamation)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des détails de la réclamation", error: error.message })
  }
}

// Annuler une réclamation (uniquement si elle est en attente)
export const cancelStagiaireReclamation = async (req, res) => {
  try {
    const { id } = req.params
    const stagiaireId = req.user._id

    const reclamation = await Reclamation.findOne({
      _id: id,
      stagiaire: stagiaireId,
      statut: "En attente",
    })

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée ou ne peut pas être annulée" })
    }

    // Supprimer la réclamation
    await Reclamation.findByIdAndDelete(id)

    res.status(200).json({ message: "Réclamation annulée avec succès" })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'annulation de la réclamation", error: error.message })
  }
}


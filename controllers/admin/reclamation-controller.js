import Reclamation from "../../models/reclamation-model.js"
import User from "../../models/user-model.js"

// Obtenir toutes les réclamations avec filtres (pour admin)
export const getAllReclamations = async (req, res) => {
  try {
    const { statut, priorite, categorie, search } = req.query

    // Construire le filtre
    const filter = {}

    if (statut) filter.statut = statut
    if (priorite) filter.priorite = priorite
    if (categorie) filter.categorie = categorie

    // Recherche par texte (nom de stagiaire ou sujet)
    if (search) {
      // Recherche par référence ou sujet
      filter.$or = [{ reference: { $regex: search, $options: "i" } }, { sujet: { $regex: search, $options: "i" } }]

      // Recherche par nom de stagiaire (nécessite une agrégation)
      const stagiaireIds = await User.find({
        $or: [{ nom: { $regex: search, $options: "i" } }, { prenom: { $regex: search, $options: "i" } }],
      }).select("_id")

      if (stagiaireIds.length > 0) {
        if (filter.$or) {
          filter.$or.push({ stagiaire: { $in: stagiaireIds.map((id) => id._id) } })
        } else {
          filter.stagiaire = { $in: stagiaireIds.map((id) => id._id) }
        }
      }
    }

    // Récupérer les réclamations avec les informations du stagiaire
    const reclamations = await Reclamation.find(filter)
      .populate("stagiaire", "nom prenom")
      .populate("assigneA", "nom prenom")
      .sort({ dateCreation: -1 })

    res.status(200).json(reclamations)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des réclamations", error: error.message })
  }
}

// Obtenir une réclamation par ID (pour admin)
export const getReclamationById = async (req, res) => {
  try {
    const { id } = req.params

    const reclamation = await Reclamation.findById(id)
      .populate("stagiaire", "nom prenom chambre")
      .populate("assigneA", "nom prenom")

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" })
    }

    res.status(200).json(reclamation)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la réclamation", error: error.message })
  }
}

// Mettre à jour le statut d'une réclamation (pour admin)
export const updateReclamationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { statut, assigneA } = req.body

    const reclamation = await Reclamation.findById(id)

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" })
    }

    reclamation.statut = statut
    reclamation.derniereMiseAJour = new Date()

    if (assigneA) {
      reclamation.assigneA = assigneA
    }

    const reclamationMiseAJour = await reclamation.save()

    res.status(200).json(reclamationMiseAJour)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut", error: error.message })
  }
}

// Mettre à jour la priorité d'une réclamation (pour admin)
export const updateReclamationPriority = async (req, res) => {
  try {
    const { id } = req.params
    const { priorite } = req.body

    const reclamation = await Reclamation.findById(id)

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" })
    }

    reclamation.priorite = priorite
    reclamation.derniereMiseAJour = new Date()

    const reclamationMiseAJour = await reclamation.save()

    res.status(200).json(reclamationMiseAJour)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la priorité", error: error.message })
  }
}

// Assigner une réclamation à un responsable (pour admin)
export const assignReclamation = async (req, res) => {
  try {
    const { id } = req.params
    const { responsableId } = req.body

    const reclamation = await Reclamation.findById(id)

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" })
    }

    reclamation.assigneA = responsableId
    reclamation.statut = "En cours"
    reclamation.derniereMiseAJour = new Date()

    const reclamationMiseAJour = await reclamation.save()

    res.status(200).json(reclamationMiseAJour)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'assignation de la réclamation", error: error.message })
  }
}

// Accepter une réclamation (pour admin)
export const acceptReclamation = async (req, res) => {
  try {
    const { id } = req.params
    const { commentaire } = req.body

    const reclamation = await Reclamation.findById(id)

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" })
    }

    reclamation.statut = "Résolu"
    reclamation.derniereMiseAJour = new Date()

    if (commentaire) {
      reclamation.commentaireResolution = commentaire
    }

    const reclamationMiseAJour = await reclamation.save()

    res.status(200).json(reclamationMiseAJour)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'acceptation de la réclamation", error: error.message })
  }
}

// Rejeter une réclamation (pour admin)
export const rejectReclamation = async (req, res) => {
  try {
    const { id } = req.params
    const { raisonRejet } = req.body

    const reclamation = await Reclamation.findById(id)

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" })
    }

    reclamation.statut = "Rejeté"
    reclamation.derniereMiseAJour = new Date()

    if (raisonRejet) {
      reclamation.raisonRejet = raisonRejet
    }

    const reclamationMiseAJour = await reclamation.save()

    res.status(200).json(reclamationMiseAJour)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du rejet de la réclamation", error: error.message })
  }
}


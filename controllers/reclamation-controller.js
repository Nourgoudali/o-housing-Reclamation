import Reclamation from "../models/reclamation-model.js"

// Obtenir toutes les réclamations avec filtres
export const getAllReclamations = async (req, res) => {
  try {
    const { statut, priorite, categorie, search, stagiaireId } = req.query

    // Construire le filtre
    const filter = {}

    if (statut) filter.statut = statut
    if (priorite) filter.priorite = priorite
    if (categorie) filter.categorie = categorie
    if (stagiaireId) filter["stagiaire.id"] = stagiaireId

    // Recherche par texte
    if (search) {
      filter.$or = [
        { reference: { $regex: search, $options: "i" } },
        { sujet: { $regex: search, $options: "i" } },
        { "stagiaire.nom": { $regex: search, $options: "i" } },
        { "stagiaire.prenom": { $regex: search, $options: "i" } },
      ]
    }

    // Récupérer les réclamations
    const reclamations = await Reclamation.find(filter).sort({ dateCreation: -1 })

    res.status(200).json(reclamations)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des réclamations", error: error.message })
  }
}

// Obtenir une réclamation par ID
export const getReclamationById = async (req, res) => {
  try {
    const { id } = req.params

    const reclamation = await Reclamation.findById(id)

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" })
    }

    res.status(200).json(reclamation)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la réclamation", error: error.message })
  }
}

// Créer une nouvelle réclamation
export const createReclamation = async (req, res) => {
  try {
    const { stagiaire, chambre, categorie, sujet, description, priorite } = req.body

    const nouvelleReclamation = new Reclamation({
      stagiaire,
      chambre,
      categorie,
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

// Mettre à jour le statut d'une réclamation
export const updateReclamationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { statut, assigneA, commentaireResolution, raisonRejet } = req.body

    const reclamation = await Reclamation.findById(id)

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" })
    }

    reclamation.statut = statut
    reclamation.derniereMiseAJour = new Date()

    if (assigneA) {
      reclamation.assigneA = assigneA
    }

    if (commentaireResolution) {
      reclamation.commentaireResolution = commentaireResolution
    }

    if (raisonRejet) {
      reclamation.raisonRejet = raisonRejet
    }

    const reclamationMiseAJour = await reclamation.save()

    res.status(200).json(reclamationMiseAJour)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut", error: error.message })
  }
}

// Mettre à jour la priorité d'une réclamation
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

// Supprimer une réclamation
export const deleteReclamation = async (req, res) => {
  try {
    const { id } = req.params

    const reclamation = await Reclamation.findById(id)

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" })
    }

    await Reclamation.findByIdAndDelete(id)

    res.status(200).json({ message: "Réclamation supprimée avec succès" })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la réclamation", error: error.message })
  }
}


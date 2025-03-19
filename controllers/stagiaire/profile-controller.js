import User from "../../models/user-model.js"
import bcrypt from "bcryptjs"

// Obtenir le profil du stagiaire
export const getStagiaireProfile = async (req, res) => {
  try {
    const stagiaireId = req.user._id

    const stagiaire = await User.findById(stagiaireId).select("-motDePasse")

    if (!stagiaire) {
      return res.status(404).json({ message: "Stagiaire non trouvé" })
    }

    res.status(200).json(stagiaire)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du profil", error: error.message })
  }
}

// Mettre à jour le profil du stagiaire
export const updateStagiaireProfile = async (req, res) => {
  try {
    const stagiaireId = req.user._id
    const { nom, prenom, email } = req.body

    const stagiaire = await User.findById(stagiaireId)

    if (!stagiaire) {
      return res.status(404).json({ message: "Stagiaire non trouvé" })
    }

    stagiaire.nom = nom || stagiaire.nom
    stagiaire.prenom = prenom || stagiaire.prenom
    stagiaire.email = email || stagiaire.email

    const updatedStagiaire = await stagiaire.save()

    res.status(200).json({
      _id: updatedStagiaire._id,
      nom: updatedStagiaire.nom,
      prenom: updatedStagiaire.prenom,
      email: updatedStagiaire.email,
      chambre: updatedStagiaire.chambre,
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error: error.message })
  }
}

// Changer le mot de passe du stagiaire
export const changeStagiairePassword = async (req, res) => {
  try {
    const stagiaireId = req.user._id
    const { ancienMotDePasse, nouveauMotDePasse } = req.body

    const stagiaire = await User.findById(stagiaireId)

    if (!stagiaire) {
      return res.status(404).json({ message: "Stagiaire non trouvé" })
    }

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(ancienMotDePasse, stagiaire.motDePasse)

    if (!isMatch) {
      return res.status(400).json({ message: "Ancien mot de passe incorrect" })
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10)
    stagiaire.motDePasse = await bcrypt.hash(nouveauMotDePasse, salt)

    await stagiaire.save()

    res.status(200).json({ message: "Mot de passe changé avec succès" })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du changement de mot de passe", error: error.message })
  }
}


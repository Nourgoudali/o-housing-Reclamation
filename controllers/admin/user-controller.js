import User from "../../models/user-model.js"
import bcrypt from "bcryptjs"

// Obtenir tous les utilisateurs (pour admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-motDePasse")
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message })
  }
}

// Obtenir un utilisateur par ID (pour admin)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).select("-motDePasse")

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error: error.message })
  }
}

// Créer un nouvel utilisateur (pour admin)
export const createUser = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, role, chambre } = req.body

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" })
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(motDePasse, salt)

    // Créer un nouvel utilisateur
    const newUser = new User({
      nom,
      prenom,
      email,
      motDePasse: hashedPassword,
      role,
      chambre,
    })

    const savedUser = await newUser.save()

    res.status(201).json({
      _id: savedUser._id,
      nom: savedUser.nom,
      prenom: savedUser.prenom,
      email: savedUser.email,
      role: savedUser.role,
      chambre: savedUser.chambre,
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error: error.message })
  }
}

// Mettre à jour un utilisateur (pour admin)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { nom, prenom, email, role, chambre } = req.body

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    user.nom = nom || user.nom
    user.prenom = prenom || user.prenom
    user.email = email || user.email
    user.role = role || user.role
    user.chambre = chambre || user.chambre

    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      nom: updatedUser.nom,
      prenom: updatedUser.prenom,
      email: updatedUser.email,
      role: updatedUser.role,
      chambre: updatedUser.chambre,
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error: error.message })
  }
}

// Supprimer un utilisateur (pour admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    await User.findByIdAndDelete(id)

    res.status(200).json({ message: "Utilisateur supprimé avec succès" })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error: error.message })
  }
}

// Obtenir tous les responsables (pour admin)
export const getResponsables = async (req, res) => {
  try {
    const responsables = await User.find({ role: "responsable" }).select("-motDePasse")

    res.status(200).json(responsables)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des responsables", error: error.message })
  }
}

// Obtenir tous les stagiaires (pour admin)
export const getStagiaires = async (req, res) => {
  try {
    const stagiaires = await User.find({ role: "stagiaire" }).select("-motDePasse")

    res.status(200).json(stagiaires)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des stagiaires", error: error.message })
  }
}


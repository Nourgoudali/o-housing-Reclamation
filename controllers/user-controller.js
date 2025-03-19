import User from "../models/user-model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Inscription d'un utilisateur
export const registerUser = async (req, res) => {
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

    // Générer un token JWT
    const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, { expiresIn: "30d" })

    res.status(201).json({
      _id: savedUser._id,
      nom: savedUser.nom,
      prenom: savedUser.prenom,
      email: savedUser.email,
      role: savedUser.role,
      chambre: savedUser.chambre,
      token,
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message })
  }
}

// Connexion d'un utilisateur
export const loginUser = async (req, res) => {
  try {
    const { email, motDePasse } = req.body

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" })
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse)

    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" })
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" })

    res.status(200).json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      chambre: user.chambre,
      token,
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message })
  }
}

// Obtenir le profil de l'utilisateur
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-motDePasse")

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du profil", error: error.message })
  }
}

// Obtenir tous les responsables
export const getResponsables = async (req, res) => {
  try {
    const responsables = await User.find({ role: "responsable" }).select("-motDePasse")

    res.status(200).json(responsables)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des responsables", error: error.message })
  }
}

// Obtenir tous les stagiaires
export const getStagiaires = async (req, res) => {
  try {
    const stagiaires = await User.find({ role: "stagiaire" }).select("-motDePasse")

    res.status(200).json(stagiaires)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des stagiaires", error: error.message })
  }
}


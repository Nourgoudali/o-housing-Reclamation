import jwt from "jsonwebtoken"
import User from "../models/user-model.js"

// Middleware pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Non autorisé, token manquant" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select("-motDePasse")

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: "Non autorisé, token invalide", error: error.message })
  }
}

// Middleware pour vérifier si l'utilisateur est un admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Accès refusé, rôle admin requis" })
  }
}

// Middleware pour vérifier si l'utilisateur est un responsable
export const isResponsable = (req, res, next) => {
  if (req.user && (req.user.role === "responsable" || req.user.role === "admin")) {
    next()
  } else {
    res.status(403).json({ message: "Accès refusé, rôle responsable ou admin requis" })
  }
}

// Middleware pour vérifier si l'utilisateur est un stagiaire
export const isStagiaire = (req, res, next) => {
  if (req.user && req.user.role === "stagiaire") {
    next()
  } else {
    res.status(403).json({ message: "Accès refusé, rôle stagiaire requis" })
  }
}


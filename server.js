import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Routes d'authentification
import authRoutes from "./routes/auth-routes.js"

// Routes admin
import adminReclamationRoutes from "./routes/admin/reclamation-routes.js"
import adminUserRoutes from "./routes/admin/user-routes.js"

// Routes stagiaire
import stagiaireReclamationRoutes from "./routes/stagiaire/reclamation-routes.js"
import stagiaireProfileRoutes from "./routes/stagiaire/profile-routes.js"

// Routes communes
import uploadRoutes from "./routes/common/upload-routes.js"
import typeRoutes from "./routes/common/type-routes.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Dossier pour les fichiers uploadés
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes d'authentification
app.use("/api/auth", authRoutes)

// Routes admin
app.use("/api/admin/reclamations", adminReclamationRoutes)
app.use("/api/admin/users", adminUserRoutes)

// Routes stagiaire
app.use("/api/stagiaire/reclamations", stagiaireReclamationRoutes)
app.use("/api/stagiaire/profile", stagiaireProfileRoutes)

// Routes communes
app.use("/api/upload", uploadRoutes)
app.use("/api/types", typeRoutes)

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connecté à MongoDB")
    app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Erreur de connexion à MongoDB:", error)
  })


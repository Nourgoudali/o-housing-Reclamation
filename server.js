import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Import des routes
import reclamationRoutes from "./routes/reclamation-routes.js"
import uploadRoutes from "./routes/upload-routes.js"
import typeRoutes from "./routes/type-routes.js"

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

// Routes
app.use("/api/reclamations", reclamationRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/types", typeRoutes)

// Route de test
app.get("/", (req, res) => {
  res.send("API O-Housing Réclamation fonctionne correctement")
})

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


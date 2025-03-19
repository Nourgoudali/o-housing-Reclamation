import mongoose from "mongoose"

const reclamationSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    stagiaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chambre: {
      type: String,
      required: true,
    },
    categorie: {
      type: String,
      required: true,
      enum: ["Absence", "Chambre", "Repas", "Électricité", "Informatique", "Maintenance", "Autre"],
    },
    sujet: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dateCreation: {
      type: Date,
      default: Date.now,
    },
    priorite: {
      type: String,
      enum: ["Haute", "Moyenne", "Faible"],
      default: "Moyenne",
    },
    statut: {
      type: String,
      enum: ["En attente", "En cours", "Résolu", "Rejeté"],
      default: "En attente",
    },
    assigneA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    derniereMiseAJour: {
      type: Date,
    },
    piecesJointes: [
      {
        nom: String,
        chemin: String,
        dateUpload: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
)

// Générer automatiquement une référence unique
reclamationSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next()
  }

  const date = new Date()
  const year = date.getFullYear()

  // Trouver le dernier numéro de référence pour cette année
  const lastReclamation = await this.constructor
    .findOne({
      reference: { $regex: `REC-${year}-` },
    })
    .sort({ reference: -1 })

  let number = 1
  if (lastReclamation) {
    const lastNumber = Number.parseInt(lastReclamation.reference.split("-")[2])
    number = lastNumber + 1
  }

  // Formater le numéro avec des zéros en tête (ex: 001, 002, etc.)
  this.reference = `REC-${year}-${number.toString().padStart(3, "0")}`
  next()
})

const Reclamation = mongoose.model("Reclamation", reclamationSchema)

export default Reclamation


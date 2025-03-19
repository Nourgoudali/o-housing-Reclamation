import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    motDePasse: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "stagiaire", "responsable"],
      default: "stagiaire",
    },
    chambre: {
      type: String,
      required: function () {
        return this.role === "stagiaire"
      },
    },
  },
  { timestamps: true },
)

// Méthode pour obtenir le nom complet
userSchema.virtual("nomComplet").get(function () {
  return `${this.prenom} ${this.nom}`
})

const User = mongoose.model("User", userSchema)

export default User


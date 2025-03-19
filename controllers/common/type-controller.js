// Obtenir tous les types de réclamation
export const getReclamationTypes = async (req, res) => {
    try {
      // Liste des types de réclamation disponibles
      const types = [
        { id: "Absence", label: "Absence" },
        { id: "Chambre", label: "Problème dans la chambre" },
        { id: "Repas", label: "Problème de repas" },
        { id: "Électricité", label: "Problème d'électricité" },
        { id: "Informatique", label: "Matériel informatique défectueux" },
        { id: "Maintenance", label: "Demande de maintenance" },
        { id: "Autre", label: "Autre" },
      ]
  
      res.status(200).json(types)
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des types de réclamation", error: error.message })
    }
  }
  
  
import { Request, Response } from "express";
import {
  getAdminReservations,
  updateStatus,
  addReservation,
  editReservation,
  removeReservation
} from "../services/adminReservation.service";
import { io } from "../index";

// Récupérer toutes les réservations
export const fetchAdminReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await getAdminReservations();
    res.json(reservations);
  } catch (err: any) {
    console.error("❌ Erreur fetchAdminReservations:", err.message);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// Ajouter une réservation (ADMIN)
export const createAdminReservation = async (req: Request, res: Response) => {
  try {
    console.log("📥 Données reçues pour création:", req.body);
    const newRes = await addReservation(req.body);
    
    io.emit("reservation_added", newRes);
    res.json({ message: "Réservation ajoutée", reservation: newRes });
  } catch (err: any) {
    console.error("❌ Erreur createAdminReservation:", err.message);
    res.status(500).json({ error: "Erreur lors de l'ajout", details: err.message });
  }
};

// Modifier une réservation (ADMIN)
export const updateAdminReservation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    console.log("📥 Données reçues pour modification (ID:", id, "):", req.body);
    
    // Vérifier que l'ID est valide
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "ID invalide" });
    }
    
    await editReservation(id, req.body);
    
    io.emit("reservation_updated", { id, ...req.body });
    res.json({ message: "Réservation mise à jour" });
  } catch (err: any) {
    console.error("❌ Erreur updateAdminReservation:", err.message);
    console.error("Stack trace:", err.stack);
    res.status(500).json({ error: "Erreur lors de la modification", details: err.message });
  }
};

// Modifier statut
export const modifyAdminStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  console.log("📥 Modification statut - ID:", id, "Statut:", status);
  
  if (!["confirmed", "cancelled", "pending"].includes(status)) {
    return res.status(400).json({ error: "Statut invalide" });
  }
  
  try {
    await updateStatus(Number(id), status);
    
    io.emit("reservation_status_changed", { id: Number(id), status });
    res.json({ message: "Statut mis à jour" });
  } catch (err: any) {
    console.error("❌ Erreur modifyAdminStatus:", err.message);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// Supprimer une réservation (ADMIN)
export const deleteAdminReservation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    console.log("🗑️ Suppression réservation ID:", id);
    
    await removeReservation(id);
    
    io.emit("reservation_deleted", { id });
    res.json({ message: "Réservation supprimée" });
  } catch (err: any) {
    console.error("❌ Erreur deleteAdminReservation:", err.message);
    res.status(500).json({ error: "Erreur lors de la suppression", details: err.message });
  }
};
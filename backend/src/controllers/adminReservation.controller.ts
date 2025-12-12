import { Request, Response } from "express";
import {
  getAdminReservations,
  updateStatus,
  addReservation,
  editReservation,
  removeReservation
} from "../services/adminReservation.service";
import { io } from "../index"; // <-- Import Socket.IO

// Récupérer toutes les réservations
export const fetchAdminReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await getAdminReservations();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Ajouter une réservation (ADMIN)
export const createAdminReservation = async (req: Request, res: Response) => {
  try {
    const newRes = await addReservation(req.body);
    
    // Émettre l'événement "reservation_added" à tous les clients connectés
    io.emit("reservation_added", newRes);

    res.json({ message: "Réservation ajoutée", reservation: newRes });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout" });
  }
};

// Modifier une réservation (ADMIN)
export const updateAdminReservation = async (req: Request, res: Response) => {
  try {
    await editReservation(Number(req.params.id), req.body);

    // Émettre l'événement "reservation_updated"
    io.emit("reservation_updated", { id: Number(req.params.id), ...req.body });

    res.json({ message: "Réservation mise à jour" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la modification" });
  }
};

// Modifier statut
export const modifyAdminStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["confirmed", "cancelled", "pending"].includes(status)) {
    return res.status(400).json({ error: "Statut invalide" });
  }

  try {
    await updateStatus(Number(id), status);

    // Émettre l'événement "reservation_status_changed"
    io.emit("reservation_status_changed", { id: Number(id), status });

    res.json({ message: "Statut mis à jour" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Supprimer une réservation (ADMIN)
export const deleteAdminReservation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await removeReservation(id);

    // Émettre l'événement "reservation_deleted"
    io.emit("reservation_deleted", { id });

    res.json({ message: "Réservation supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};

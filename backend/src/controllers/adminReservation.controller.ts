import { Request, Response } from "express";
import { getAdminReservations, updateStatus } from "../services/adminReservation.service";

// Récupérer toutes les réservations avec le nom des chambres
export const fetchAdminReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await getAdminReservations();
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mettre à jour le statut d’une réservation
export const modifyAdminStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["confirmed", "cancelled", "pending"].includes(status)) {
    return res.status(400).json({ error: "Statut invalide" });
  }

  try {
    await updateStatus(Number(id), status);
    res.json({ message: "Statut mis à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

import { Request, Response } from "express";
import {
  getReservations,
  createReservation,
  updateStatus,
} from "../services/reservation.service";

export const fetchReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await getReservations();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const addReservation = async (req: Request, res: Response) => {
  try {
    const id = await createReservation(req.body);
    res.json({ message: "Réservation enregistrée", id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const modifyStatus = async (req: Request, res: Response) => {
  try {
    await updateStatus(Number(req.params.id), req.body.status);
    res.json({ message: "Statut mis à jour" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

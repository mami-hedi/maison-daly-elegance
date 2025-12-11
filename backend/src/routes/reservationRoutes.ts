import express from "express";
import {
  fetchReservations,
  addReservation,
  modifyStatus,
} from "../controllers/reservation.controller";
import { db } from "../db";

const router = express.Router();

/**
 * Récupérer toutes les réservations (côté client)
 */
router.get("/", fetchReservations);

/**
 * Récupérer uniquement les jours réservés (pour le calendrier)
 */
router.get("/days", async (req, res) => {
  try {
    const [rows]: any = await db.query(
      "SELECT checkin, checkout FROM reservations WHERE status != 'cancelled'"
    );

    // Générer un tableau contenant tous les jours réservés individuellement
    const reservedDays: string[] = [];

    rows.forEach((reservation: any) => {
      const start = new Date(reservation.checkin);
      const end = new Date(reservation.checkout);

      // boucle jour par jour
      for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
  // Convertir en date locale pour éviter les décalages UTC
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  reservedDays.push(localDate.toISOString().split("T")[0]);
}


    });

    res.json({ reservedDays });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur /days" });
  }
});

/**
 * Ajouter une nouvelle réservation
 */
router.post("/", addReservation);

/**
 * Modifier le statut d'une réservation (admin)
 */
router.put("/:id/status", modifyStatus);

export default router;

import { Router } from "express";
import { db } from "../db";

const router = Router();

// 🔹 Retourne toutes les chambres (pour admin)
router.get("/", async (req, res) => {
  try {
    const [rooms] = await db.query("SELECT id, name FROM rooms ORDER BY name ASC");
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 Retourne uniquement les chambres disponibles pour un intervalle donné
router.get("/available", async (req, res) => {
  const { checkin, checkout } = req.query;

  if (!checkin || !checkout) {
    return res.status(400).json({ error: "Dates requises" });
  }

  try {
    const sql = `
      SELECT *
      FROM rooms
      WHERE id NOT IN (
        SELECT room_id
        FROM reservations
        WHERE NOT (
          checkout <= ? OR checkin >= ?
        )
      )
    `;

    const [rooms] = await db.query(sql, [checkin, checkout]);
    console.log("💥 CHECK SQL PARAMS :", checkin, checkout);

    return res.json(rooms);
  } catch (error: any) {
    console.error("🔥 ERREUR SQL :", error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;

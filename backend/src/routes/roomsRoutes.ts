import { Router } from "express";
import { db } from "../db";

const router = Router();

// 🔹 Toutes les chambres (ADMIN)
router.get("/", async (req, res) => {
  try {
    const [rooms] = await db.query(
      "SELECT id, name FROM rooms ORDER BY name ASC"
    );
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 Chambres disponibles selon dates
router.get("/available", async (req, res) => {
  const { checkin, checkout } = req.query;

  if (!checkin || !checkout) {
    return res.status(400).json({ error: "Dates requises" });
  }

  try {
    // ✅ Normalisation DATE (anti J-1)
    const checkinDate = new Date(checkin as string)
      .toISOString()
      .split("T")[0];

    const checkoutDate = new Date(checkout as string)
      .toISOString()
      .split("T")[0];

    const sql = `
      SELECT *
      FROM rooms
      WHERE id NOT IN (
        SELECT room_id
        FROM reservations
        WHERE status IN ('confirmed', 'pending')
          AND NOT (
            DATE(checkout) <= ?
            OR DATE(checkin) >= ?
          )
      )
    `;

    const [rooms] = await db.query(sql, [checkinDate, checkoutDate]);

    console.log("✅ DISPONIBILITÉ");
    console.log("checkin :", checkinDate);
    console.log("checkout:", checkoutDate);

    return res.json(rooms);

  } catch (error: any) {
    console.error("🔥 ERREUR SQL :", error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;

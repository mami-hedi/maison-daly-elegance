import { Router } from "express";
import { db } from "../db";

const router = Router();

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
        WHERE (checkin < ? AND checkout > ?)
      )
    `;

    // order: (selected_checkout, selected_checkin)
    const [rooms] = await db.query(sql, [checkout, checkin]);

    return res.json(rooms);

  } catch (error: any) {
    console.error("🔥 ERREUR SQL :", error);
    return res.status(500).json({ error: error.message });
  }
});



export default router;

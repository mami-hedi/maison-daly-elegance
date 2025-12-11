import express from "express";
import { fetchAdminReservations, modifyAdminStatus } from "../controllers/adminReservation.controller";

const router = express.Router();

// GET — Récupérer toutes les réservations
router.get("/", fetchAdminReservations);

// PUT — Mettre à jour le statut d’une réservation
router.put("/:id/status", modifyAdminStatus);

export default router;

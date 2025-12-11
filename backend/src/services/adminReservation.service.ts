import { db } from "../db";

export interface AdminReservation {
  id: number;
  room_id: number;
  room_name: string;
  name: string;
  email: string;
  phone: string;
  checkin: string;  // YYYY-MM-DD
  checkout: string; // YYYY-MM-DD
  message?: string;
  status: "confirmed" | "cancelled" | "pending";
}

// Récupérer toutes les réservations avec le nom de la chambre
export const getAdminReservations = async (): Promise<AdminReservation[]> => {
  const [rows] = await db.query(`
    SELECT r.*, rm.name AS room_name
    FROM reservations r
    JOIN rooms rm ON r.room_id = rm.id
    ORDER BY r.checkin ASC
  `);
  return rows as AdminReservation[];
};

// Mettre à jour le statut d’une réservation
export const updateStatus = async (id: number, status: AdminReservation["status"]) => {
  const [result] = await db.query(
    `UPDATE reservations SET status = ? WHERE id = ?`,
    [status, id]
  );
  return result;
};

import { db } from "../db";

export const getAdminReservations = async () => {
  const [rows] = await db.query(`
    SELECT r.*, rm.name AS room_name
    FROM reservations r
    JOIN rooms rm ON r.room_id = rm.id
    ORDER BY r.checkin ASC
  `);
  return rows;
};

// Ajouter réservation ADMIN
export const addReservation = async (data: any) => {
  const sql = `
    INSERT INTO reservations
    (room_id, name, email, phone, checkin, checkout, message, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.room_id,
    data.name,
    data.email,
    data.phone,
    data.checkin,
    data.checkout,
    data.message || null,
    data.status || "confirmed",
  ];

  const [result]: any = await db.query(sql, values);
  return { id: result.insertId, ...data };
};

// Modifier réservation ADMIN
export const editReservation = async (id: number, data: any) => {
  const sql = `
    UPDATE reservations SET
    room_id = ?, name = ?, email = ?, phone = ?, checkin = ?, checkout = ?, message = ?, status = ?
    WHERE id = ?
  `;

  await db.query(sql, [
    data.room_id,
    data.name,
    data.email,
    data.phone,
    data.checkin,
    data.checkout,
    data.message || null,
    data.status,
    id
  ]);
};

// Modifier le statut
export const updateStatus = async (id: number, status: string) => {
  await db.query(`UPDATE reservations SET status = ? WHERE id = ?`, [status, id]);
};

// Supprimer réservation
export const removeReservation = async (id: number) => {
  await db.query(`DELETE FROM reservations WHERE id = ?`, [id]);
};

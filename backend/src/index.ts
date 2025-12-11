import express from "express";
import cors from "cors";
import reservationRoutes from "./routes/reservationRoutes";
import adminReservationRoutes from "./routes/adminReservationRoutes";
import roomsRoutes from "./routes/roomsRoutes";


const app = express();
app.use(cors());
app.use(express.json());

// Front-end client
app.use("/api/reservations", reservationRoutes);

// Back-office admin
app.use("/api/admin/reservations", adminReservationRoutes);

app.use("/api/rooms", roomsRoutes);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

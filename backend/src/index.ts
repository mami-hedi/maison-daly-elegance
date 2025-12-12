import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import reservationRoutes from "./routes/reservationRoutes";
import adminReservationRoutes from "./routes/adminReservationRoutes";
import roomsRoutes from "./routes/roomsRoutes";

const app = express();
const server = http.createServer(app);

// Config Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080", // ton front React
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Client connecté", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client déconnecté", socket.id);
  });
});

// Middlewares
app.use(cors());
app.use(express.json());

// Front-end client
app.use("/api/reservations", reservationRoutes);

// Back-office admin
app.use("/api/admin/reservations", adminReservationRoutes);

// Rooms
app.use("/api/rooms", roomsRoutes);

// Démarrage serveur
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

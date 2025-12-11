import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Reservation = sequelize.define("Reservation", {
  room_id: { type: DataTypes.INTEGER },
  room_name: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  checkin: { type: DataTypes.DATEONLY },
  checkout: { type: DataTypes.DATEONLY },
  message: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: "pending" },
});

export default Reservation;

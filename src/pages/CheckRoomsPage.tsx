import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckAvailability } from "@/components/CheckAvailability";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

interface Room {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export default function CheckRoomsPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🌟 Stocker les deux dates pour les envoyer dans l'URL
  const [selectedCheckin, setSelectedCheckin] = useState("");
  const [selectedCheckout, setSelectedCheckout] = useState("");

  const isPastDate = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    return date < today;
  };

  const searchRooms = async (checkin: string, checkout: string) => {
    setLoading(true);
    setError(null);
    setRooms([]);

    // ⭐️ Sauvegarde des dates pour la redirection
    setSelectedCheckin(checkin);
    setSelectedCheckout(checkout);

    if (isPastDate(checkin) || isPastDate(checkout)) {
      setError("Vous ne pouvez pas sélectionner une date passée.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/rooms/available?checkin=${checkin}&checkout=${checkout}`
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Erreur inconnue");
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Format des données invalide.");
      }

      setRooms(data);
    } catch (err: any) {
      setError(err.message || "Erreur serveur");
    }

    setLoading(false);
  };

  // 🌟 Redirection vers la chambre + dates dans URL
  const goToRoom = (roomName: string) => {
    const urlName = roomName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    navigate(
      `/chambres/${urlName}?checkin=${selectedCheckin}&checkout=${selectedCheckout}`
    );
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          Vérifier les chambres disponibles
        </h1>

        <CheckAvailability onSearch={searchRooms} />

        {loading && <p className="text-center mt-4">Chargement...</p>}

        {error && (
          <p className="text-center text-red-600 font-medium mt-4">{error}</p>
        )}

        <h2 className="text-xl font-bold mt-6 mb-4 text-center">
          Chambres Disponibles
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {rooms.length === 0 && !loading && !error && (
            <p className="text-gray-600 text-center col-span-2">
              Aucune chambre à afficher
            </p>
          )}

          {rooms.map((room) => (
            <div key={room.id} className="border rounded p-4 shadow-sm">
              <h3 className="font-bold text-lg">{room.name}</h3>
              <p className="text-gray-600">{room.price} TND / nuit</p>

              <Button className="mt-3" onClick={() => goToRoom(room.name)}>
                Réserver
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

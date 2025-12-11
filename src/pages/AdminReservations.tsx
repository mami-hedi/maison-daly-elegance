import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Reservation {
  id: number;
  room_id: number;
  room_name: string;
  name: string;
  email: string;
  phone: string;
  checkin: string;
  checkout: string;
  message?: string;
  status: "confirmed" | "cancelled" | "pending";
}

export function AdminReservations() {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger toutes les réservations admin
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/admin/reservations");
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id: number, status: Reservation["status"]) => {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/reservations/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      toast({ title: "Succès", description: "Statut mis à jour" });
      fetchReservations();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  // Pagination
const itemsPerPage = 10;
const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.ceil(reservations.length / itemsPerPage);

const paginatedReservations = reservations.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages) return;
  setCurrentPage(page);
};


  return (
  <div className="px-8 py-6">
    {/* Message en haut */}
    <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
      Ici vous pouvez gérer toutes les réservations effectuées par les clients.
    </div>

    {/* Titre centré */}
    <h1 className="text-3xl font-bold text-center mb-6">Gestion des Réservations</h1>

    {loading ? (
      <p className="text-center">Chargement...</p>
    ) : (
      <>
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Chambre</th>
              <th className="p-3 border">Nom</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Téléphone</th>
              <th className="p-3 border">Arrivée</th>
              <th className="p-3 border">Départ</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReservations.map((r) => (
              <tr key={r.id} className="text-center border-t">
                <td className="p-3 border">{r.room_name}</td>
                <td className="p-3 border">{r.name}</td>
                <td className="p-3 border">{r.email}</td>
                <td className="p-3 border">{r.phone}</td>
                <td className="p-3 border">{r.checkin}</td>
                <td className="p-3 border">{r.checkout}</td>
                <td
                  className={`p-3 border font-bold ${
                    r.status === "confirmed"
                      ? "text-green-600"
                      : r.status === "cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {r.status}
                </td>
                <td className="p-3 border space-x-2">
  <Button 
    size="sm" 
    className="bg-green-600 hover:bg-green-700 text-white" 
    onClick={() => handleStatusChange(r.id, "confirmed")}
  >
    Confirmer
  </Button>
  <Button
    size="sm"
    variant="destructive"
    onClick={() => handleStatusChange(r.id, "cancelled")}
  >
    Annuler
  </Button>
</td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <Button size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            Précédent
          </Button>
          <span>
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      </>
    )}
  </div>
);

}

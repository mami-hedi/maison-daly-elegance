import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { io } from "socket.io-client";

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
  payment_status?: "paid" | "unpaid" | "partial";
  advance_amount?: number; // si partial
}

interface Room {
  id: number;
  name: string;
}

type SortKey = "name" | "room_name" | "checkin" | "checkout" | "status";

export function AdminReservations() {

  const socket = io("http://localhost:3000");
  
  useEffect(() => {
    fetchReservations();
    fetchRooms();

    socket.on("reservationUpdated", () => {
      fetchReservations();
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "cancelled" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  // FormData
const [formData, setFormData] = useState({
  room_id: 0,
  name: "",
  email: "",
  phone: "",
  checkin: "",
  checkout: "",
  message: "",
  status: "confirmed",
  payment_status: "unpaid",
  advance_amount: 0,
});

  const [sortKey, setSortKey] = useState<SortKey>("checkin");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/rooms");
      if (!res.ok) throw new Error("Erreur chargement chambres");
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les chambres",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchRooms();
  }, []);

  const filteredReservations = reservations
    .filter(r =>
      statusFilter === "all" ? true : r.status === statusFilter
    )
    .filter(r =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.room_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let valA: any = a[sortKey];
      let valB: any = b[sortKey];
      if (sortKey === "checkin" || sortKey === "checkout") {
        valA = new Date(valA);
        valB = new Date(valB);
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

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

  const handleDeleteReservation = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette réservation ?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/admin/reservations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression");
      toast({ title: "Succès", description: "Réservation supprimée" });
      fetchReservations();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer",
        variant: "destructive",
      });
    }
  };

  const formatDateForInput = (dateStr: string) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const openForm = (reservation?: Reservation) => {
  if (reservation) {
    setEditingReservation(reservation);
    setFormData({
      ...reservation,
      checkin: formatDateForInput(reservation.checkin),
      checkout: formatDateForInput(reservation.checkout),
      payment_status: reservation.payment_status || "unpaid",
      advance_amount: reservation.advance_amount || "",
    });
  } else {
    setEditingReservation(null);
    setFormData({
      room_id: 0,
      name: "",
      email: "",
      phone: "",
      checkin: "",
      checkout: "",
      message: "",
      status: "confirmed",
      payment_status: "unpaid",
      advance_amount: "",
    });
  }
  setFormOpen(true);
};



  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingReservation
        ? `http://localhost:3000/api/admin/reservations/${editingReservation.id}`
        : "http://localhost:3000/api/admin/reservations";
      const method = editingReservation ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erreur serveur");
      toast({ title: "Succès", description: `Réservation ${editingReservation ? "modifiée" : "ajoutée"}` });
      setFormOpen(false);
      fetchReservations();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la réservation",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="px-8 py-6">
      <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
        Ici vous pouvez gérer toutes les réservations effectuées par les clients.
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">Gestion des Réservations</h1>

      {/* Filtre, recherche et bouton ajouter */}
      <div className="flex justify-between mb-4 items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="font-medium">Filtrer par statut:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border rounded px-2 py-1"
          >
            <option value="all">Tous</option>
            <option value="confirmed">Confirmé</option>
            <option value="cancelled">Annulé</option>
            <option value="pending">En attente</option>
          </select>
        </div>

        <Input
          placeholder="Recherche par nom, email ou chambre"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-2 py-1"
        />

        <Button onClick={() => openForm()} className="bg-blue-600 hover:bg-blue-700 text-white">
          Ajouter
        </Button>
      </div>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <>
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100 cursor-pointer">
              <tr>
                <th className="p-3 border" onClick={() => handleSort("room_name")}>Chambre</th>
                <th className="p-3 border" onClick={() => handleSort("name")}>Nom</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Téléphone</th>
                <th className="p-3 border" onClick={() => handleSort("checkin")}>Arrivée</th>
                <th className="p-3 border" onClick={() => handleSort("checkout")}>Départ</th>
                <th className="p-3 border">Paiement</th>
                <th className="p-3 border" onClick={() => handleSort("status")}>Status</th>
                <th className="p-3 border">Actions</th>
                <th className="p-3 border">Gestion</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReservations.map(r => (
                <tr key={r.id} className="text-center border-t">
                  <td className="p-3 border">{r.room_name}</td>
                  <td className="p-3 border">{r.name}</td>
                  <td className="p-3 border">{r.email}</td>
                  <td className="p-3 border">{r.phone}</td>
                  <td className="p-3 border">{formatDate(r.checkin)}</td>
                  <td className="p-3 border">{formatDate(r.checkout)}</td>
                  <td className="p-3 border">
  {r.payment_status === "paid" && <span className="text-green-600 font-bold">Payé</span>}
  {r.payment_status === "unpaid" && <span className="text-red-600 font-bold">Non payé</span>}
  {r.payment_status === "partial" && (
    <span className="text-yellow-600 font-bold">
      Avance : {r.advance_amount}€
    </span>
  )}
</td>

                  <td className={`p-3 border font-bold ${
                      r.status === "confirmed" ? "text-green-600" :
                      r.status === "cancelled" ? "text-red-600" : "text-yellow-600"
                  }`}>{r.status}</td>
                  <td className="p-3 border space-x-2">
                    <Button size="sm" onClick={() => handleStatusChange(r.id, "confirmed")} className="bg-green-600 hover:bg-green-700 text-white">Confirmer</Button>
                    <Button size="sm" onClick={() => handleStatusChange(r.id, "cancelled")} variant="destructive">Annuler</Button>
                  </td>
                  <td className="p-3 border space-x-2">
                    <Button size="sm" onClick={() => openForm(r)} className="bg-yellow-500 hover:bg-yellow-600 text-white">Modifier</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteReservation(r.id)}>Supprimer</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center mt-4 space-x-2">
            <Button size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Précédent</Button>
            <span>Page {currentPage} sur {totalPages}</span>
            <Button size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Suivant</Button>
          </div>
        </>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingReservation ? "Modifier la réservation" : "Ajouter une réservation"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveReservation} className="space-y-4">
            <div>
              <Label>Chambre *</Label>
              <select name="room_id" value={formData.room_id} onChange={handleFormChange} required className="w-full border rounded px-2 py-1">
                <option value="">Sélectionner une chambre</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Nom *</Label>
              <Input name="name" value={formData.name} onChange={handleFormChange} required />
            </div>
            <div>
              <Label>Email *</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleFormChange} required />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input name="phone" value={formData.phone} onChange={handleFormChange} />
            </div>
            <div>
              <Label>Arrivée *</Label>
              <Input type="date" name="checkin" value={formData.checkin} onChange={handleFormChange} required />
            </div>
            <div>
              <Label>Départ *</Label>
              <Input type="date" name="checkout" value={formData.checkout} onChange={handleFormChange} required />
            </div>
            <div>
              <div>
  <Label>Statut de paiement</Label>
  <select
    name="payment_status"
    value={formData.payment_status}
    onChange={handleFormChange}
    className="w-full border rounded px-2 py-1"
  >
    <option value="paid">Payé</option>
    <option value="unpaid">Non payé</option>
    <option value="partial">Avance</option>
  </select>
</div>

{formData.payment_status === "partial" && (
  <div>
    <Label>Montant de l'avance (€)</Label>
    <Input
      type="number"
      name="advance_amount"
      value={formData.advance_amount}
      onChange={handleFormChange}
      min={0}
      step={0.01}
      required
    />
  </div>
)}

              <Label>Message</Label>
              <Textarea name="message" value={formData.message} onChange={handleFormChange} />
            </div>
            <div>
              <Label>Status</Label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className={`w-full border rounded px-2 py-1 ${
                  formData.status === "confirmed" ? "text-green-600" :
                  formData.status === "cancelled" ? "text-red-600" : "text-yellow-600"
                }`}
              >
                <option value="confirmed">Confirmé</option>
                <option value="cancelled">Annulé</option>
                <option value="pending">En attente</option>
              </select>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {editingReservation ? "Modifier" : "Ajouter"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

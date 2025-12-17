import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { io } from "socket.io-client";
import { FaEdit, FaTrash, FaTachometerAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar"; // <-- nouveau composant


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
  advance_amount?: number;
  total?: number; // ✅ AJOUT IMPORTANT
}


interface Room {
  id: number;
  name: string;
}

type SortKey = "name" | "room_name" | "checkin" | "checkout" | "status";

export function AdminReservations() {
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
  
  // ✅ CORRECTION 1: Type correct pour advance_amount (number | string)
  const [formData, setFormData] = useState<{
    room_id: number;
    name: string;
    email: string;
    phone: string;
    checkin: string;
    checkout: string;
    message: string;
    status: string;
    payment_status: string;
    advance_amount: number | string;
  }>({
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

  // ✅ CORRECTION 2: Socket.io initialisé correctement dans useEffect
  useEffect(() => {
    fetchReservations();
    fetchRooms();

    const socket = io("http://localhost:3000");

    socket.on("reservationUpdated", () => {
      fetchReservations();
    });

    return () => {
      socket.disconnect();
    };
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
        room_id: reservation.room_id,
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        checkin: formatDateForInput(reservation.checkin),
        checkout: formatDateForInput(reservation.checkout),
        message: reservation.message || "",
        status: reservation.status,
        payment_status: reservation.payment_status || "unpaid",
        advance_amount: reservation.advance_amount || 0,
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
        advance_amount: 0,
      });
    }
    setFormOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "advance_amount" || name === "room_id" ? Number(value) : value
    }));
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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur serveur");
      }

      toast({ 
        title: "Succès", 
        description: `Réservation ${editingReservation ? "modifiée" : "ajoutée"}` 
      });
      setFormOpen(false);
      fetchReservations();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer la réservation",
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

  const StatusBadge = ({ status }: { status: Reservation["status"] }) => {
  const styles = {
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      {status === "confirmed" && "Confirmé"}
      {status === "cancelled" && "Annulé"}
      {status === "pending" && "En attente"}
    </span>
  );
};

const PaymentBadge = ({
  status,
  amount,
  total,
}: {
  status?: string;
  amount?: number;
  total?: number;
}) => {
  if (status === "paid") {
    return (
      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
        Payé
      </span>
    );
  }

  if (status === "partial") {
    const rest = total ? total - (amount || 0) : 0;
    return (
      <div className="flex flex-col items-center text-xs">
        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
          Avance {amount} DT
        </span>
        <span className="text-orange-600 mt-1">
          Reste {rest.toFixed(2)} DT
        </span>
      </div>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
      Non payé
    </span>
  );
};
const navigate = useNavigate();

const totalReservations = reservations.length;

const confirmedReservations = reservations.filter(
  r => r.status === "confirmed"
).length;

const pendingReservations = reservations.filter(
  r => r.status === "pending"
).length;

const paidReservations = reservations.filter(
  r => r.payment_status === "paid"
).length;

const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
  <div className="flex min-h-screen bg-gray-100">
    <Sidebar active="reservations" />

    {/* Contenu principal */}
    <main className="flex-1 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
        Ici vous pouvez gérer toutes les réservations effectuées par les clients.
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">Gestion des Réservations</h1>

      {/* Tableau de bord des stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-xl p-5 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors duration-300">
          <div>
            <p className="text-sm text-blue-700">Total réservations</p>
            <p className="text-2xl font-bold text-blue-900">{totalReservations}</p>
          </div>
          <div className="bg-blue-200 text-blue-700 p-3 rounded-full text-xl">📅</div>
        </div>

        <div className="rounded-xl p-5 flex items-center justify-between bg-green-50 hover:bg-green-100 transition-colors duration-300">
          <div>
            <p className="text-sm text-green-700">Confirmées</p>
            <p className="text-2xl font-bold text-green-900">{confirmedReservations}</p>
          </div>
          <div className="bg-green-200 text-green-700 p-3 rounded-full text-xl">✅</div>
        </div>

        <div className="rounded-xl p-5 flex items-center justify-between bg-yellow-50 hover:bg-yellow-100 transition-colors duration-300">
          <div>
            <p className="text-sm text-yellow-700">En attente</p>
            <p className="text-2xl font-bold text-yellow-900">{pendingReservations}</p>
          </div>
          <div className="bg-yellow-200 text-yellow-700 p-3 rounded-full text-xl">⏳</div>
        </div>

        <div className="rounded-xl p-5 flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 transition-colors duration-300">
          <div>
            <p className="text-sm text-emerald-700">Payées</p>
            <p className="text-2xl font-bold text-emerald-900">{paidReservations}</p>
          </div>
          <div className="bg-emerald-200 text-emerald-700 p-3 rounded-full text-xl">💳</div>
        </div>
      </div>

      {/* Filtre, recherche et bouton ajouter */}
<div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
  
  {/* Filtre */}
  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
    <label className="font-medium">Filtrer par statut :</label>
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value as any)}
      className="border rounded px-2 py-1 w-full md:w-auto"
    >
      <option value="all">Tous</option>
      <option value="confirmed">Confirmé</option>
      <option value="cancelled">Annulé</option>
      <option value="pending">En attente</option>
    </select>
  </div>

  {/* Recherche */}
  <Input
    placeholder="Recherche par nom, email ou chambre"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full md:max-w-xs"
  />

  {/* Bouton */}
  <Button
    onClick={() => openForm()}
    className="flex items-center justify-center gap-2 w-full md:w-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
  >
    <span className="text-lg leading-none">+</span>
    Ajouter une réservation
  </Button>

</div>


      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Chambre</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Telephone</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3 text-center">Total (DT)</th>
                  <th className="px-4 py-3 text-center">Paiement</th>
                  <th className="px-4 py-3 text-center">Statut</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
  {paginatedReservations.map(r => (
    <tr key={r.id} className="border-t hover:bg-gray-50">
      <td className="px-4 py-3 font-medium">{r.room_name}</td>

      <td className="px-4 py-3">
        <div className="font-medium">{r.name}</div>
        <div className="text-gray-500 text-xs">{r.email}</div>
      </td>

      <td className="px-4 py-3 text-left">
        <div className="font-medium">{r.phone}</div>
      </td>

      <td className="px-4 py-3 text-center">
        <div>{formatDate(r.checkin)}</div>
        <div className="text-gray-400 text-xs">→ {formatDate(r.checkout)}</div>
      </td>

      {/* 🔥 NOUVEAU : Nombre de nuits */}
      <td className="px-4 py-3 text-center">
        {r.nights} nuit{r.nights > 1 ? "s" : ""}
      </td>

      {/* 🔥 NOUVEAU : Total à payer */}
      <td className="px-4 py-3 text-center">
        {Number(r.total)?.toFixed(2)} Dinars
      </td>

       <td className="px-4 py-3 text-center">
  {r.payment_status === "paid" && (
    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Payé</span>
  )}
  {r.payment_status === "unpaid" && (
    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">Non payé</span>
  )}
  {r.payment_status === "partial" && (
    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
      Avance {Number(r.advance_amount).toFixed(2)} Dinars - Reste {(
        Number(r.total) - Number(r.advance_amount)
      ).toFixed(2)} Dinars
    </span>
  )}
</td>



      <td className="px-4 py-3 text-center">
        <StatusBadge status={r.status} />
      </td>

      <td className="px-4 py-3 text-center">
        <div className="flex justify-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => openForm(r)}
            className="flex items-center justify-center"
          >
            <FaEdit />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteReservation(r.id)}
            className="flex items-center justify-center"
          >
            <FaTrash />
          </Button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>

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
                <Label>Montant de l'avance (DT)</Label>
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

            <div>
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
    </main>
</div>
);
}


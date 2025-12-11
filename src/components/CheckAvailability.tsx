import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CheckAvailability({ onSearch }: { onSearch: (checkin: string, checkout: string) => void }) {
const [checkin, setCheckin] = useState("");
const [checkout, setCheckout] = useState("");

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
if (!checkin || !checkout) return alert("Veuillez sélectionner les deux dates.");
onSearch(checkin, checkout);
};

return ( <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow space-y-3 max-w-md mx-auto mt-6"> <h2 className="text-xl font-semibold text-center">Vérifier la disponibilité</h2>

  <div>
    <label className="block text-sm mb-1">Date d'arrivée</label>
    <Input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} />
  </div>

  <div>
    <label className="block text-sm mb-1">Date de départ</label>
    <Input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} />
  </div>

  <Button type="submit" className="w-full">Rechercher</Button>
</form>


);
}

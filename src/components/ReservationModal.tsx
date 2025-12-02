import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Room } from "@/data/rooms";

interface ReservationModalProps {
  room: Room;
  children: React.ReactNode;
}

export function ReservationModal({ room, children }: ReservationModalProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkin: "",
    checkout: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Demande envoyée !",
      description: `Votre réservation pour la chambre ${room.name} a été transmise. Nous vous répondrons rapidement.`,
    });
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      checkin: "",
      checkout: "",
      message: "",
    });
    setIsSubmitting(false);
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Réserver la chambre <span className="text-primary">{room.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-secondary/50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-body text-sm text-muted-foreground">Prix par nuit</p>
              <p className="font-display text-2xl font-bold text-primary">{room.price}€</p>
            </div>
            <div className="text-right">
              <p className="font-body text-sm text-muted-foreground">Capacité</p>
              <p className="font-body font-medium">{room.capacity} pers. • {room.size}m²</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="modal-name" className="font-body">Nom complet *</Label>
            <Input
              id="modal-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1"
              placeholder="Votre nom"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="modal-email" className="font-body">Email *</Label>
              <Input
                id="modal-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <Label htmlFor="modal-phone" className="font-body">Téléphone</Label>
              <Input
                id="modal-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="modal-checkin" className="font-body">Arrivée *</Label>
              <Input
                id="modal-checkin"
                name="checkin"
                type="date"
                value={formData.checkin}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="modal-checkout" className="font-body">Départ *</Label>
              <Input
                id="modal-checkout"
                name="checkout"
                type="date"
                value={formData.checkout}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="modal-message" className="font-body">Message (optionnel)</Label>
            <Textarea
              id="modal-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 min-h-[80px]"
              placeholder="Demandes particulières..."
            />
          </div>

          <Button 
            type="submit" 
            variant="default" 
            size="lg" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
          </Button>
          
          <p className="font-body text-xs text-muted-foreground text-center">
            Petit-déjeuner inclus • Annulation gratuite jusqu'à 48h avant
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

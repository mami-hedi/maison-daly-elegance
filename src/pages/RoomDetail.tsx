import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ReservationModal } from "@/components/ReservationModal";
import { getRoomBySlug } from "@/data/rooms";
import { Users, Maximize, Check, ArrowLeft } from "lucide-react";
import roomKhadija from "@/assets/room-khadija.jpg";
import roomSarra from "@/assets/room-sarra.jpg";
import roomDaly from "@/assets/room-daly.jpg";
import roomGhada from "@/assets/room-ghada.jpg";
import roomPapo from "@/assets/room-papo.jpg";
import roomAch from "@/assets/room-ach.jpg";

const roomImages: Record<string, string> = {
  khadija: roomKhadija,
  sarra: roomSarra,
  daly: roomDaly,
  ghada: roomGhada,
  papo: roomPapo,
  ach: roomAch,
};

const RoomDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const room = slug ? getRoomBySlug(slug) : undefined;

  if (!room) {
    return <Navigate to="/chambres" replace />;
  }

  const roomImage = roomImages[room.slug];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${roomImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        </div>
        <div className="relative z-10 container-custom pb-12">
          <Link 
            to="/chambres"
            className="inline-flex items-center gap-2 text-background/80 hover:text-background mb-6 transition-colors font-body text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux chambres
          </Link>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-background mb-4 animate-fade-in">
            Chambre {room.name}
          </h1>
          <div className="flex items-center gap-6 text-background/90 animate-fade-in animate-delay-200">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-body">{room.capacity} personnes</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize className="w-5 h-5" />
              <span className="font-body">{room.size} m²</span>
            </div>
            <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full font-body font-medium">
              {room.price}DT / nuit
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-3xl font-semibold text-foreground mb-6">
                Description
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                {room.fullDescription}
              </p>

              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                Équipements & Services
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {room.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-body text-sm text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-secondary rounded-lg p-6 sticky top-24">
                <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                  Réserver cette chambre
                </h3>
                <p className="font-body text-muted-foreground text-sm mb-6">
                  Remplissez le formulaire pour effectuer votre demande de réservation.
                </p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-display text-4xl font-bold text-primary">{room.price}Dinars</span>
                  <span className="font-body text-muted-foreground">/ nuit</span>
                </div>
                <ReservationModal room={room}>
                  <Button variant="default" size="lg" className="w-full">
                    Réserver maintenant
                  </Button>
                </ReservationModal>
                <p className="font-body text-xs text-muted-foreground text-center mt-4">
                  Petit-déjeuner inclus • Annulation gratuite
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RoomDetail;

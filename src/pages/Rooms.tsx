import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ReservationModal } from "@/components/ReservationModal";
import { rooms } from "@/data/rooms";
import { Users, Maximize } from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";
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

const Rooms = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative z-10 text-center container-custom">
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-background mb-4 animate-fade-in">
            Nos Chambres
          </h1>
          <p className="font-body text-lg text-background/90 animate-fade-in animate-delay-200">
            Six univers uniques pour un séjour d'exception
          </p>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <div 
                key={room.id}
                className="group bg-card rounded-lg overflow-hidden shadow-sm border border-border animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link to={`/chambres/${room.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={roomImages[room.slug]}
                      alt={`Chambre ${room.name}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-body font-medium">
                      {room.price}DT / nuit
                    </div>
                  </div>
                </Link>
                <div className="p-6">
                  <Link to={`/chambres/${room.slug}`}>
                    <h3 className="font-display text-2xl font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                      {room.name}
                    </h3>
                  </Link>
                  <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">
                    {room.shortDescription}
                  </p>
                  <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{room.capacity} pers.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      <span>{room.size} m²</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button asChild variant="outline" className="flex-1">
                      <Link to={`/chambres/${room.slug}`}>Voir détails</Link>
                    </Button>
                    <ReservationModal room={room}>
                      <Button variant="default" className="flex-1">
                        Réserver
                      </Button>
                    </ReservationModal>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-semibold text-foreground mb-6">
              Inclus dans chaque séjour
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {["Petit-déjeuner", "Wi-Fi gratuit", "Parking", "Linge de maison"].map((item) => (
                <div key={item} className="bg-background p-4 rounded-lg">
                  <p className="font-body text-sm font-medium text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Rooms;

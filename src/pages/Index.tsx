import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { rooms } from "@/data/rooms";
import { ArrowRight, Star, Users, Home as HomeIcon } from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";
import roomKhadija from "@/assets/room-khadija.jpg";
import roomSarra from "@/assets/room-sarra.jpg";
import roomDaly from "@/assets/room-daly.jpg";

const featuredRooms = rooms.slice(0, 3);
const roomImages: Record<string, string> = {
  khadija: roomKhadija,
  sarra: roomSarra,
  daly: roomDaly,
};

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        <div className="relative z-10 text-center container-custom">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-background mb-6 animate-fade-in">
            Maison <span className="text-primary">MH</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-background/90 max-w-2xl mx-auto mb-10 animate-fade-in animate-delay-200">
            Une maison d'hôtes d'exception où l'élégance rencontre le confort. 
            Découvrez un havre de paix au cœur de la tradition et du raffinement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animate-delay-300">
            <Button asChild variant="hero" size="lg">
              <Link to="/chambres">Découvrir nos chambres</Link>
            </Button>
            <Button asChild variant="hero-outline" size="lg">
              <Link to="/disponibilite">Recherche Disponibilité</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Bienvenue chez nous
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Nichée au cœur d'un cadre idyllique, Maison MH vous ouvre ses portes 
              pour un séjour inoubliable. Notre maison d'hôtes allie le charme de 
              l'architecture traditionnelle au confort moderne, créant ainsi une 
              atmosphère unique où chaque détail est pensé pour votre bien-être.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HomeIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">6 Chambres Uniques</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Chaque chambre possède sa propre identité et son caractère unique.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Service d'Excellence</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Un accueil chaleureux et un service attentionné à chaque instant.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Ambiance Familiale</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Une atmosphère conviviale où vous vous sentirez comme chez vous.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Nos Chambres
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos chambres soigneusement décorées, chacune portant un nom 
              cher à notre cœur et offrant une expérience unique.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRooms.map((room, index) => (
              <Link
                key={room.id}
                to={`/chambres/${room.slug}`}
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                  <img
                    src={roomImages[room.slug]}
                    alt={`Chambre ${room.name}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl font-semibold text-background mb-2">
                      {room.name}
                    </h3>
                    <p className="font-body text-sm text-background/80">
                      À partir de {room.price}DT / nuit
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/chambres" className="flex items-center gap-2">
                Voir toutes les chambres
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-100 text-background">
  <div className="container-custom text-center">
   <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 text-black">
  Prêt pour un séjour <span className="text-red-600">inoubliable</span> ?
</h2>
<p className="font-body text-black/80 max-w-2xl mx-auto mb-10">
  Réservez dès maintenant et laissez-nous vous offrir une expérience 
  exceptionnelle. Notre équipe se fera un plaisir de vous accueillir.
</p>

    <Button asChild variant="hero" size="lg">
      <Link to="/chambres">Réserver maintenant</Link>
    </Button>
  </div>
</section>

    </Layout>
  );
};

export default Index;

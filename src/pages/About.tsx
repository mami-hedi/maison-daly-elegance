import { Layout } from "@/components/layout/Layout";
import { Heart, Award, Clock, Leaf } from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";

const values = [
  {
    icon: Heart,
    title: "Hospitalité",
    description: "Nous accueillons chaque hôte comme un membre de notre famille, avec chaleur et sincérité."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Chaque détail compte. Nous visons l'excellence dans tous les aspects de votre séjour."
  },
  {
    icon: Clock,
    title: "Tradition",
    description: "Nous perpétuons les traditions d'accueil tout en embrassant le confort moderne."
  },
  {
    icon: Leaf,
    title: "Authenticité",
    description: "Une expérience vraie et sincère, ancrée dans notre culture et notre histoire."
  }
];

const About = () => {
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
            À Propos
          </h1>
          <p className="font-body text-lg text-background/90 animate-fade-in animate-delay-200">
            Découvrez l'histoire de Maison Daly
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-4xl font-semibold text-foreground mb-6">
                  Notre Histoire
                </h2>
                <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                  <p>
                    Maison Daly est née d'un rêve : celui de créer un lieu où chaque 
                    voyageur pourrait se sentir chez soi, loin de chez soi. Fondée 
                    par la famille Daly, cette maison d'hôtes incarne les valeurs 
                    d'hospitalité qui nous sont chères depuis des générations.
                  </p>
                  <p>
                    Chaque chambre porte le nom d'un membre de notre famille, 
                    reflétant ainsi l'histoire et l'âme de notre maison. De Khadija 
                    à Ach, en passant par Sarra, Daly, Ghada et Papo, chaque espace 
                    raconte une histoire unique.
                  </p>
                  <p>
                    Notre mission est simple : vous offrir un séjour mémorable 
                    dans un cadre authentique où le confort moderne se marie 
                    harmonieusement avec le charme traditionnel.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-lg overflow-hidden">
                  <img
                    src={heroImage}
                    alt="Maison Daly"
                    className="w-full h-full object-cover"
                  />
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-semibold text-foreground mb-4">
              Nos Valeurs
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Les principes qui guident notre accueil et notre engagement envers vous.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className="bg-background p-8 rounded-lg text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl font-semibold text-foreground mb-6">
              Une Équipe Dévouée
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Derrière Maison Daly, il y a une équipe passionnée qui met tout en 
              œuvre pour rendre votre séjour exceptionnel. De l'accueil à la 
              préparation de votre chambre, en passant par les conseils pour 
              découvrir la région, nous sommes là pour vous.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              Notre engagement ? Que vous repartiez avec des souvenirs inoubliables 
              et l'envie de revenir.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

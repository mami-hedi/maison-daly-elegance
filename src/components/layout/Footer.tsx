import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-semibold mb-4">
              Maison <span className="text-primary">Daly</span>
            </h3>
            <p className="font-body text-sm text-background/70 leading-relaxed">
              Une maison d'hôtes d'exception où le confort rencontre l'élégance.
              Votre havre de paix pour un séjour inoubliable.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Navigation</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="font-body text-sm text-background/70 hover:text-primary transition-colors">
                Accueil
              </Link>
              <Link to="/a-propos" className="font-body text-sm text-background/70 hover:text-primary transition-colors">
                À Propos
              </Link>
              <Link to="/chambres" className="font-body text-sm text-background/70 hover:text-primary transition-colors">
                Nos Chambres
              </Link>
              <Link to="/contact" className="font-body text-sm text-background/70 hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:contact@maisondaly.com" className="flex items-center gap-3 font-body text-sm text-background/70 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                contact@maisondaly.com
              </a>
              <a href="tel:+33123456789" className="flex items-center gap-3 font-body text-sm text-background/70 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +33 1 23 45 67 89
              </a>
              <div className="flex items-start gap-3 font-body text-sm text-background/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>123 Rue de la Paix<br />75000 Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="font-body text-sm text-background/50">
            © {new Date().getFullYear()} Maison Daly. Tous droits réservés. <a href="https://www.mh-digital-solution.com" target="_blank">MH Digital Solution</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

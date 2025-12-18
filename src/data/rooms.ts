export interface Room {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  capacity: number;
  size: number;
  price: number;
  amenities: string[];
  image: string;
}

export const rooms: Room[] = [
  {
    id: "1",
    name: "ch MH1",
    slug: "khadija",
    shortDescription: "Une chambre élégante aux tons chaleureux, idéale pour un séjour romantique.",
    fullDescription: "La chambre ch MH1 vous accueille dans une atmosphère raffinée où le rouge profond se marie harmonieusement avec le blanc immaculé. Dotée d'un lit king-size et d'une salle de bain privative en marbre, cette chambre offre une vue imprenable sur le jardin. Parfaite pour les couples en quête d'intimité et de confort.",
    capacity: 2,
    size: 25,
    price: 120,
    amenities: ["Lit King-Size", "Salle de bain privée", "Vue jardin", "Climatisation", "Wi-Fi gratuit", "Petit-déjeuner inclus"],
    image: "/src/assets/room-khadija.jpg"
  },
  {
    id: "2",
    name: "ch MH2",
    slug: "sarra",
    shortDescription: "Une suite sophistiquée alliant modernité et tradition.",
    fullDescription: "La suite ch MH2 représente l'alliance parfaite entre le design contemporain et l'artisanat traditionnel. Ses 30m² vous offrent un espace généreux avec coin salon, un lit queen-size exceptionnellement confortable et une terrasse privée. Les touches de noir et blanc créent une ambiance chic et apaisante.",
    capacity: 2,
    size: 30,
    price: 150,
    amenities: ["Lit Queen-Size", "Terrasse privée", "Coin salon", "Minibar", "Coffre-fort", "Service de chambre"],
    image: "/src/assets/room-sarra.jpg"
  },
  {
    id: "3",
    name: "ch MH3",
    slug: "daly",
    shortDescription: "Notre suite signature offrant le summum du luxe.",
    fullDescription: "La suite ch MH3 est notre joyau, portant fièrement le nom de notre maison. Cette suite de 40m² incarne l'excellence avec son lit à baldaquin, sa baignoire îlot et son salon privé. Chaque détail a été pensé pour vous offrir une expérience inoubliable. Vue panoramique sur les jardins et service de conciergerie dédié.",
    capacity: 2,
    size: 40,
    price: 200,
    amenities: ["Lit à baldaquin", "Baignoire îlot", "Salon privé", "Vue panoramique", "Conciergerie", "Champagne de bienvenue"],
    image: "/src/assets/room-daly.jpg"
  },
  {
    id: "4",
    name: "ch MH 4",
    slug: "ghada",
    shortDescription: "Une chambre lumineuse d'inspiration méditerranéenne.",
    fullDescription: "La chambre Ghada capture l'essence de la Méditerranée avec ses murs blancs, ses touches de terracotta et sa lumière naturelle abondante. Idéale pour les voyageurs en quête de sérénité, elle dispose d'un lit double confortable et d'une douche à l'italienne. Le balcon offre une vue apaisante sur la cour intérieure.",
    capacity: 2,
    size: 22,
    price: 100,
    amenities: ["Lit Double", "Balcon", "Douche italienne", "Climatisation", "Wi-Fi gratuit", "Petit-déjeuner inclus"],
    image: "/src/assets/room-ghada.jpg"
  },
  {
    id: "5",
    name: "ch MH 5",
    slug: "papo",
    shortDescription: "Un cocon chaleureux au charme vintage.",
    fullDescription: "La chambre ch MH 5 vous transporte dans une ambiance chaleureuse où le charme vintage rencontre le confort moderne. Son coin lecture près de la fenêtre, ses textiles doux et sa décoration soignée en font un refuge parfait. Cette chambre de 20m² convient parfaitement aux voyageurs solo ou aux couples.",
    capacity: 2,
    size: 20,
    price: 90,
    amenities: ["Lit Double", "Coin lecture", "Salle d'eau", "Chauffage", "Wi-Fi gratuit", "Thé et café offerts"],
    image: "/src/assets/room-papo.jpg"
  },
  {
    id: "6",
    name: "ch MH 6",
    slug: "ach",
    shortDescription: "Une chambre contemporaine aux lignes épurées.",
    fullDescription: "La chambre  incarne le minimalisme élégant avec ses lignes pures et ses matériaux nobles. Son design contemporain, rehaussé par des touches de couleur soigneusement choisies, crée une atmosphère zen propice au repos. Grandes fenêtres, lit queen-size et équipements modernes vous attendent.",
    capacity: 2,
    size: 24,
    price: 110,
    amenities: ["Lit Queen-Size", "Design contemporain", "Smart TV", "Climatisation", "Wi-Fi haut débit", "Petit-déjeuner inclus"],
    image: "/src/assets/room-ach.jpg"
  }
];

export function getRoomBySlug(slug: string): Room | undefined {
  return rooms.find(room => room.slug === slug);
}

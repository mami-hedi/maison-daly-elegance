import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages existantes
import Index from "./pages/Index";
import About from "./pages/About";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Contact from "./pages/Contact";
import  CheckRoomsPage  from "./pages/CheckRoomsPage";
import NotFound from "./pages/NotFound";

import { AdminReservations } from "./pages/AdminReservations";


// Nouvelle page calendrier
import Reservations from "./pages/Reservations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/chambres" element={<Rooms />} />
          <Route path="/chambres/:slug" element={<RoomDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reservations" element={<Reservations />} /> {/* Calendrier */}
          <Route path="/admin/reservations" element={<AdminReservations />} />
          <Route path="/disponibilite" element={<CheckRoomsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

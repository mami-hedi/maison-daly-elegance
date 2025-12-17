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
import { AdminClients } from "./pages/AdminClients";
import { AdminAvailability } from "./pages/AdminAvailability";
import { AdminLogin } from "./pages/AdminLogin";

import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";

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
          
          <Route path="/disponibilite" element={<CheckRoomsPage />} />
          {/* Admin login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin routes protégées */}
          <Route 
            path="/admin/reservations" 
            element={
              <ProtectedAdminRoute>
                <AdminReservations />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/clients" 
            element={
              <ProtectedAdminRoute>
                <AdminClients />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/availability" 
            element={
              <ProtectedAdminRoute>
                <AdminAvailability />
              </ProtectedAdminRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

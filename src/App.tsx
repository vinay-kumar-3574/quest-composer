
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TripSummary from "./pages/TripSummary";
import FlightBooking from "./pages/FlightBooking";
import HotelBooking from "./pages/HotelBooking";
import TourGuide from "./pages/TourGuide";
import EmergencySOS from "./pages/EmergencySOS";
import BudgetTracker from "./pages/BudgetTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/trip-summary" element={<TripSummary />} />
          <Route path="/flights" element={<FlightBooking />} />
          <Route path="/hotels" element={<HotelBooking />} />
          <Route path="/guide" element={<TourGuide />} />
          <Route path="/emergency" element={<EmergencySOS />} />
          <Route path="/budget" element={<BudgetTracker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

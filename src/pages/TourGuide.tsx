
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardOverview from './dashboard/DashboardOverview';
import AIGuideChat from './dashboard/AIGuideChat';
import SmartItinerary from './dashboard/SmartItinerary';
import ScenarioPlanner from './dashboard/ScenarioPlanner';
import ReturnTicketBooking from './dashboard/ReturnTicketBooking';
import TripSummary from './dashboard/TripSummary';
import BudgetTracker from './BudgetTracker';
import EmergencySOS from './EmergencySOS';
import FlightBooking from './FlightBooking';
import HotelBooking from './HotelBooking';

const TourGuide = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/guide" replace />} />
        <Route path="" element={<DashboardOverview />} />
        <Route path="chat" element={<AIGuideChat />} />
        <Route path="itinerary" element={<SmartItinerary />} />
        <Route path="scenarios" element={<ScenarioPlanner />} />
        <Route path="budget" element={<BudgetTracker />} />
        <Route path="emergency" element={<EmergencySOS />} />
        <Route path="flights" element={<FlightBooking />} />
        <Route path="hotels" element={<HotelBooking />} />
        <Route path="return-booking" element={<ReturnTicketBooking />} />
        <Route path="summary" element={<TripSummary />} />
      </Route>
    </Routes>
  );
};

export default TourGuide;

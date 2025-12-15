import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateAttestation from "./pages/CreateAttestation";
import Verify from "./pages/Verify";
import Credentials from "./pages/Credentials";
import Payments from "./pages/Payments";
import DefiScore from "./pages/DefiScore";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

import { Toaster as HotToast } from "react-hot-toast";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <HotToast position="bottom-right" toastOptions={{
      style: {
        background: '#1a1b1e',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)'
      }
    }} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/create" element={<Layout><CreateAttestation /></Layout>} />
        <Route path="/verify" element={<Layout><Verify /></Layout>} />
        <Route path="/credentials" element={<Layout><Credentials /></Layout>} />
        <Route path="/payments" element={<Layout><Payments /></Layout>} />
        <Route path="/defi-score" element={<Layout><DefiScore /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;

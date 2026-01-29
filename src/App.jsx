import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import PropertiesPage from "./pages/Properties";
import PropertyDetailPage from "./pages/PropertyDetail";
import SavedPage from "./pages/Saved";
import ProfilePage from "./pages/Profile";
import ListPropertyPage from "./pages/ListProperty";
import AdminPage from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/list-property" element={<ListPropertyPage />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

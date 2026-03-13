import React from "react";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { UniversalSearch } from "../components/organisms/UniversalSearch";
import { HubNavigation } from "../components/organisms/HubNavigation";
import { useAuth } from "../context/AuthContext";

// Componentes modulares
import { WelcomeWidget } from "../components/organisms/WelcomeWidget";
import { UniversityLinksWidget } from "../components/organisms/UniversityLinksWidget";
import { NewsWidget } from "../components/organisms/NewsWidget";

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();

  return (
    <DashboardLayout>
      
      <UniversalSearch />

      <WelcomeWidget userName={user?.name} />

      <UniversityLinksWidget isAdmin={isAdmin} />

      <HubNavigation />

      <NewsWidget />

    </DashboardLayout>
  );
};
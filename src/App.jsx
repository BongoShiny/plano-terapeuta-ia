import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { ClinicProvider, useClinic } from '@/context/ClinicContext';
import ManageUsers from './pages/ManageUsers';
import ManageClinics from './pages/ManageClinics';
import SelectClinic from './pages/SelectClinic';
import PendingApproval from './pages/PendingApproval';
import InviteUsers from './pages/InviteUsers';
import VibeLogin from './pages/VibeLogin';
import BlockedUser from './pages/BlockedUser';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const ClinicGate = ({ children }) => {
  const { isBlocked, isApproved, loading, user, selectedClinic, isSuperAdmin } = useClinic();
  
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user && isBlocked) {
    return <BlockedUser />;
  }

  return children;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      return <VibeLogin />;
    }
  }

  // Render the main app
  return (
    <ClinicGate>
    <Routes>
      <Route path="/select-clinic" element={<SelectClinic />} />
      <Route path="/pending-approval" element={<PendingApproval />} />
      <Route path="/invite-users" element={<InviteUsers />} />
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/ManageUsers" element={
        <LayoutWrapper currentPageName="Gestão de Usuários">
          <ManageUsers />
        </LayoutWrapper>
      } />
      <Route path="/ManageClinics" element={
        <LayoutWrapper currentPageName="Gestão de Clínicas">
          <ManageClinics />
        </LayoutWrapper>
      } />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </ClinicGate>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ClinicProvider>
          <Router>
            <NavigationTracker />
            <Routes>
              <Route path="/login" element={<VibeLogin />} />
              <Route path="*" element={<AuthenticatedApp />} />
            </Routes>
          </Router>
          <Toaster />
        </ClinicProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
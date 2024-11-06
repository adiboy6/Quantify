// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import { Profile } from "./Profile.jsx";
import { Home } from "./Home.jsx";
import CreateAccount from "./User/CreateAccount";
import Login from "./User/Login";
import "./styles/components.css";
import "./App.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import SavedJobs from './Dashboard/savedJobs';
import Dashboard from './Dashboard/Dashboard.jsx';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Public Route Component (redirects to home if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Theme>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <div className="container mx-auto px-4 py-8">
                <Routes>
                  <Route
                    path="/"
                    element={
                      //<ProtectedRoute>
                      <Home />
                      //</ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-account"
                    element={
                      <PublicRoute>
                        <CreateAccount />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route path="/dashboard" element={<Dashboard />}>
                  <Route path="saved-jobs" element={<SavedJobs />} />
                </Route>
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </Theme>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

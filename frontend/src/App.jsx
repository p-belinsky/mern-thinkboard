import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/authStore";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();



  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  if (!user || !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const VerificationRoute = ({ children }) => {
  const { isAuthenticated,  user } = useAuthStore();



  // ✅ Allow if not authenticated at all
  if (!isAuthenticated) {
    return children;
  }

  // ✅ Allow if authenticated but not verified
  if (user && !user.isVerified) {
    return children;
  }

  // 🚫 Redirect if authenticated and verified
  return <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();



  // 🚫 If authenticated and verified, block access
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};


const App = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [location.pathname,checkAuth]);

  if (isCheckingAuth) {
    // Prevent all rendering while checking auth
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary scale-200"></span>
      </div>
    );
  }

  return (
<>
      <Toaster
        position="top-right"
        toastOptions={{
          // We'll use a custom toast component below, so keep style light here
          style: {
            boxShadow: "0 4px 15px rgb(0 255 157 / 0.3)",
            borderRadius: "0.5rem",
            padding: "0", // reset padding since custom toast adds padding
          },
          // Default duration & other options can go here
        }}

      />

    <div className="relative h-full w-full">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/note/:id"
          element={
            <ProtectedRoute>
              <NoteDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/verify-email" element={<VerificationRoute><EmailVerificationPage /></VerificationRoute>} />
      </Routes>
    </div>
    </>
  );
};

export default App;

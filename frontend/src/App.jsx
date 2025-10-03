import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";
import { AuthProvider, useAuth } from "./AuthContext";
import ResetPassword from "./components/ResetPassword";
import Home from "./components/Home";
import Footer from "./components/Footer";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <Home />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            }
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>

        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;

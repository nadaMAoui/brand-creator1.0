import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard/Dashboard";
import BrandPage from "./pages/BrandPage/BrandPage";
import Profile from "./pages/Profile/Profile";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import PublishedStore from "./pages/PublishedStore/PublishedStore";

const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2Z2VkZnRoaGpvcWZremhienB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0MDg1NTAsImV4cCI6MjAzMjk4NDU1MH0.yDdlMyuGWHjXq6mYqUO9plYDJ5MdXTCnTXid55ukcB8";
const projectUrl = "https://lvgedfthhjoqfkzhbzpu.supabase.co";
const supabase = createClient(projectUrl, anonKey);

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const ProtectedRoute = ({ element }) => {
    return session ? element : <Navigate to="/" />;
  };

  function logout() {
    supabase.auth.signOut();
  }

  const centerAuthStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    flexDirection: "column"
  };

  return (
    <Router>
      <div className="App">
        {session && <Header logout={logout} />}
        <Routes>
          <Route
            path="/"
            element={
              !session ? (
                <div style={centerAuthStyle}>
                  <Typography variant="h4" component="h2" gutterBottom>
                    BRAND CREATOR
                  </Typography>
                  <Auth
                    supabaseClient={supabase}
                    appearance={{
                      theme: ThemeSupa,
                      variables: {
                        default: {
                          colors: {
                            brand: "#007bff",
                            brandAccent: "#007bff",
                          },
                        },
                      },
                    }}
                    providers={[]}
                  />
                </div>
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              session ? (
                <Dashboard supabase={supabase} user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/design/:brandName"
            element={
              session ? (
                <BrandPage supabase={supabase} user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute element={<Profile supabase={supabase} user={user} />} />
            }
          />
          <Route
            path="/:brandName"
            element={
              <PublishedStore supabase={supabase} />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;

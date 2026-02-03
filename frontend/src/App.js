import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MusicProvider } from "./context/MusicContext";
import { Toaster } from "./components/ui/sonner";
import PrivateRoute from "./components/PrivateRoute";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Favorites from "./pages/Favorites";
import PlaylistDetail from "./pages/PlaylistDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <MusicProvider>
                  <div className="h-screen flex flex-col bg-black">
                    <div className="flex flex-1 overflow-hidden">
                      <Sidebar />
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/playlist/:id" element={<PlaylistDetail />} />
                      </Routes>
                    </div>
                    <Player />
                  </div>
                </MusicProvider>
              </PrivateRoute>
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

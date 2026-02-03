import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicProvider } from "./context/MusicContext";
import { Toaster } from "./components/ui/sonner";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Favorites from "./pages/Favorites";
import PlaylistDetail from "./pages/PlaylistDetail";

function App() {
  return (
    <MusicProvider>
      <BrowserRouter>
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
        <Toaster />
      </BrowserRouter>
    </MusicProvider>
  );
}

export default App;

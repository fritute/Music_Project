import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Library, PlusCircle, Heart, Music, LogOut, User } from 'lucide-react';
import { useMusicContext } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import UploadMusic from './UploadMusic';

const Sidebar = () => {
  const location = useLocation();
  const { playlists, createPlaylist } = useMusicContext();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName, newPlaylistDesc);
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="w-64 bg-black/95 h-full flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <Music className="w-8 h-8 text-purple-500" />
          <span className="text-white font-bold text-xl">MusicStream</span>
        </Link>
      </div>

      <nav className="flex-1 px-2">
        <Link
          to="/"
          className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 ${
            isActive('/') ? 'bg-white/10 text-white' : 'text-gray-400'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="font-semibold">Início</span>
        </Link>

        <Link
          to="/search"
          className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 ${
            isActive('/search') ? 'bg-white/10 text-white' : 'text-gray-400'
          }`}
        >
          <Search className="w-6 h-6" />
          <span className="font-semibold">Buscar</span>
        </Link>

        <Link
          to="/library"
          className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 ${
            isActive('/library') ? 'bg-white/10 text-white' : 'text-gray-400'
          }`}
        >
          <Library className="w-6 h-6" />
          <span className="font-semibold">Sua Biblioteca</span>
        </Link>

        <div className="my-6 border-t border-gray-800"></div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center space-x-4 px-4 py-3 rounded-lg text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-white w-full">
              <PlusCircle className="w-6 h-6" />
              <span className="font-semibold">Criar Playlist</span>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">Nova Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Nome da playlist"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Textarea
                placeholder="Descrição (opcional)"
                value={newPlaylistDesc}
                onChange={(e) => setNewPlaylistDesc(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button
                onClick={handleCreatePlaylist}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Criar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Link
          to="/favorites"
          className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 ${
            isActive('/favorites') ? 'bg-white/10 text-white' : 'text-gray-400'
          }`}
        >
          <Heart className="w-6 h-6" />
          <span className="font-semibold">Músicas Curtidas</span>
        </Link>

        <div className="mt-4 space-y-2">
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className="block px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 truncate"
            >
              {playlist.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
import React from 'react';
import { Heart } from 'lucide-react';
import { useMusicContext } from '../context/MusicContext';
import MusicCard from '../components/MusicCard';

const Favorites = () => {
  const { musics, user } = useMusicContext();
  const favoriteMusics = musics.filter(m => user.favoriteIds.includes(m.id));

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-gradient-to-b from-pink-900/20 to-black min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-b from-pink-900/40 to-transparent p-8 pb-6">
          <div className="flex items-end space-x-6">
            <div className="w-56 h-56 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg shadow-2xl flex items-center justify-center">
              <Heart className="w-24 h-24 text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white uppercase mb-2">Playlist</p>
              <h1 className="text-6xl font-bold text-white mb-6">Músicas Curtidas</h1>
              <p className="text-gray-300">
                <span className="font-semibold">{user.name}</span> • {favoriteMusics.length} músicas
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {favoriteMusics.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {favoriteMusics.map((music) => (
                <MusicCard key={music.id} music={music} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Heart className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">Nenhuma música curtida ainda</p>
              <p className="text-gray-500">Clique no coração para adicionar suas favoritas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
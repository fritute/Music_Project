import React from 'react';
import { Play, Heart, MoreVertical } from 'lucide-react';
import { useMusicContext } from '../context/MusicContext';

const MusicCard = ({ music }) => {
  const { playMusic, currentMusic, isPlaying, user, toggleFavorite } = useMusicContext();
  const isCurrentMusic = currentMusic?.id === music.id;
  const isFavorite = user.favoriteIds.includes(music.id);

  return (
    <div className="group relative bg-gray-900/40 rounded-lg p-4 hover:bg-gray-800/60 transition-all duration-300 cursor-pointer">
      <div className="relative aspect-square mb-4 overflow-hidden rounded-md">
        <img
          src={music.coverUrl}
          alt={music.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => playMusic(music)}
            className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-200 shadow-xl"
          >
            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-white font-semibold truncate">{music.title}</h3>
        <p className="text-gray-400 text-sm truncate">{music.artist}</p>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">{music.genre}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(music.id);
          }}
          className="transition-colors duration-200"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite
                ? 'text-pink-500 fill-pink-500'
                : 'text-gray-500 hover:text-pink-500'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default MusicCard;
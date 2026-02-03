import React from 'react';
import { Link } from 'react-router-dom';
import { Music, ListMusic } from 'lucide-react';
import { useMusicContext } from '../context/MusicContext';

const Library = () => {
  const { playlists, musics } = useMusicContext();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-gradient-to-b from-purple-900/20 to-black min-h-screen">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-white mb-8">Sua Biblioteca</h1>

          {/* Playlists */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <ListMusic className="w-6 h-6 mr-2" />
              Playlists
            </h2>
            {playlists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {playlists.map((playlist) => {
                  const playlistMusics = musics.filter(m => playlist.musicIds.includes(m.id));
                  const totalDuration = playlistMusics.reduce((acc, m) => acc + m.duration, 0);
                  const minutes = Math.floor(totalDuration / 60);

                  return (
                    <Link
                      key={playlist.id}
                      to={`/playlist/${playlist.id}`}
                      className="bg-gray-900/40 rounded-lg p-4 hover:bg-gray-800/60 transition-all duration-300 group"
                    >
                      <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mb-4 flex items-center justify-center">
                        <ListMusic className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-white font-semibold mb-1 truncate">{playlist.name}</h3>
                      <p className="text-gray-400 text-sm truncate">
                        {playlistMusics.length} músicas • {minutes} min
                      </p>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-900/40 rounded-lg">
                <ListMusic className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Você ainda não tem playlists</p>
                <p className="text-gray-500 text-sm mt-2">Crie sua primeira playlist na barra lateral</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Library;
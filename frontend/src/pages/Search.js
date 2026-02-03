import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useMusicContext } from '../context/MusicContext';
import MusicCard from '../components/MusicCard';
import { Input } from '../components/ui/input';

const Search = () => {
  const { musics } = useMusicContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMusics = searchQuery
    ? musics.filter(
        (music) =>
          music.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          music.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          music.genre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : musics;

  const genres = ['Pop', 'R&B', 'Rock', 'Hip Hop', 'Eletrônica', 'Jazz'];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-gradient-to-b from-pink-900/20 to-black min-h-screen">
        <div className="p-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-xl">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar músicas, artistas ou gêneros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-800 text-white h-12 text-base"
              />
            </div>
          </div>

          {!searchQuery ? (
            <>
              {/* Browse by Genre */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Explorar por gênero</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {genres.map((genre, index) => (
                    <button
                      key={genre}
                      className="h-32 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 hover:scale-105 transition-transform duration-200 flex items-end p-4"
                      onClick={() => setSearchQuery(genre)}
                    >
                      <span className="text-white font-bold text-2xl">{genre}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* All Music */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Todas as músicas</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {musics.map((music) => (
                    <MusicCard key={music.id} music={music} />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">
                {filteredMusics.length} resultado(s) para "{searchQuery}"
              </h2>
              {filteredMusics.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {filteredMusics.map((music) => (
                    <MusicCard key={music.id} music={music} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">Nenhuma música encontrada</p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
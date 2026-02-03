import React from 'react';
import { useMusicContext } from '../context/MusicContext';
import MusicCard from '../components/MusicCard';

const Home = () => {
  const { musics } = useMusicContext();

  const recentlyPlayed = musics.slice(0, 6);
  const recommended = musics.slice(2, 8);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-gradient-to-b from-purple-900/20 to-black min-h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Boa noite</h1>
            <p className="text-gray-400">Suas músicas favoritas te esperando</p>
          </div>

          {/* Recently Played */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Tocadas recentemente</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {recentlyPlayed.map((music) => (
                <MusicCard key={music.id} music={music} />
              ))}
            </div>
          </section>

          {/* Recommended */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Recomendadas para você</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {recommended.map((music) => (
                <MusicCard key={music.id} music={music} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Trash2, X, ListMusic } from 'lucide-react';
import { useMusicContext } from '../context/MusicContext';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';

const PlaylistDetail = () => {
  const { id } = useParams();
  const { playlists, musics, playMusic, removeFromPlaylist, deletePlaylist } = useMusicContext();
  const { toast } = useToast();

  const playlist = playlists.find(p => p.id === id);

  if (!playlist) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <ListMusic className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Playlist não encontrada</p>
          <Link to="/library" className="text-purple-500 hover:underline mt-2 inline-block">
            Voltar para biblioteca
          </Link>
        </div>
      </div>
    );
  }

  const playlistMusics = musics.filter(m => playlist.musicIds.includes(m.id));
  const totalDuration = playlistMusics.reduce((acc, m) => acc + m.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  const handleDeletePlaylist = () => {
    deletePlaylist(id);
    toast({
      title: "Playlist excluída",
      description: `${playlist.name} foi removida da sua biblioteca.`
    });
  };

  const handleRemoveMusic = (musicId) => {
    removeFromPlaylist(id, musicId);
    toast({
      title: "Música removida",
      description: "A música foi removida da playlist."
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-gradient-to-b from-purple-900/40 to-black min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-b from-purple-900/60 to-transparent p-8 pb-6">
          <div className="flex items-end space-x-6">
            <div className="w-56 h-56 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-2xl flex items-center justify-center">
              <ListMusic className="w-24 h-24 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white uppercase mb-2">Playlist</p>
              <h1 className="text-6xl font-bold text-white mb-4">{playlist.name}</h1>
              {playlist.description && (
                <p className="text-gray-300 mb-4">{playlist.description}</p>
              )}
              <p className="text-gray-300">
                {playlistMusics.length} músicas •{' '}
                {hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 py-6 flex items-center space-x-4">
          {playlistMusics.length > 0 && (
            <button
              onClick={() => playMusic(playlistMusics[0])}
              className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
              <Play className="w-6 h-6 text-white ml-1" fill="white" />
            </button>
          )}
          <Button
            variant="outline"
            onClick={handleDeletePlaylist}
            className="border-gray-700 text-gray-300 hover:text-white hover:border-red-600 hover:bg-red-600/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir Playlist
          </Button>
        </div>

        {/* Music List */}
        <div className="px-8 pb-8">
          {playlistMusics.length > 0 ? (
            <div className="space-y-2">
              {playlistMusics.map((music, index) => (
                <div
                  key={music.id}
                  className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
                >
                  <span className="text-gray-400 w-8 text-center">{index + 1}</span>
                  <img
                    src={music.coverUrl}
                    alt={music.title}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{music.title}</p>
                    <p className="text-gray-400 text-sm truncate">{music.artist}</p>
                  </div>
                  <span className="text-gray-400 text-sm">{music.genre}</span>
                  <span className="text-gray-400 text-sm w-16 text-right">
                    {Math.floor(music.duration / 60)}:{(music.duration % 60).toString().padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => handleRemoveMusic(music.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ListMusic className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">Esta playlist está vazia</p>
              <p className="text-gray-500">Adicione músicas para começar a ouvir</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
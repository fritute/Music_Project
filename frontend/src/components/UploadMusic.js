import React, { useState } from 'react';
import { Upload, X, Music } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UploadMusic = ({ onUploadComplete }) => {
  const { getAuthHeader } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione um arquivo de áudio",
          variant: "destructive"
        });
        return;
      }
      
      setAudioFile(file);
      
      // Get audio duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        setAudioDuration(Math.floor(audio.duration));
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!audioFile) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo de áudio",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('genre', genre);
      formData.append('duration', audioDuration);
      if (coverUrl) {
        formData.append('coverUrl', coverUrl);
      }

      const response = await axios.post(`${API}/music/upload`, formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      });

      toast({
        title: "Música enviada!",
        description: `${title} foi adicionada com sucesso`
      });

      // Reset form
      setTitle('');
      setArtist('');
      setGenre('');
      setCoverUrl('');
      setAudioFile(null);
      setAudioDuration(0);
      setIsOpen(false);

      // Callback to refresh music list
      if (onUploadComplete) {
        onUploadComplete(response.data);
      }
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: error.response?.data?.detail || "Falha ao enviar música",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload Música
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">Enviar Nova Música</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Título</label>
            <Input
              placeholder="Nome da música"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Artista</label>
            <Input
              placeholder="Nome do artista"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Gênero</label>
            <Input
              placeholder="Pop, Rock, R&B, etc."
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">URL da Capa (opcional)</label>
            <Input
              placeholder="https://exemplo.com/imagem.jpg"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Arquivo de Áudio (MP3)</label>
            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                required
                className="hidden"
                id="audio-file"
              />
              <label
                htmlFor="audio-file"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-purple-500 transition-colors duration-200 bg-gray-800/50"
              >
                {audioFile ? (
                  <div className="text-center">
                    <Music className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                    <p className="text-white font-medium">{audioFile.name}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {(audioFile.size / 1024 / 1024).toFixed(2)} MB • {Math.floor(audioDuration / 60)}:{(audioDuration % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">Clique para selecionar arquivo</p>
                    <p className="text-gray-500 text-sm mt-1">MP3, WAV, OGG (max 50MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isUploading ? 'Enviando...' : 'Enviar Música'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadMusic;
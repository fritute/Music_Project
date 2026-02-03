import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MusicContext = createContext();

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  const { user, getAuthHeader, isAuthenticated } = useAuth();
  const [musics, setMusics] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(new Audio());

  // Fetch data on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchMusics();
      fetchPlaylists();
    }
  }, [isAuthenticated]);

  const fetchMusics = async () => {
    try {
      const response = await axios.get(`${API}/music`);
      setMusics(response.data);
    } catch (error) {
      console.error('Failed to fetch musics:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(`${API}/playlist`, {
        headers: getAuthHeader()
      });
      setPlaylists(response.data);
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playMusic = (music) => {
    if (currentMusic?.id === music.id) {
      togglePlay();
    } else {
      setCurrentMusic(music);
      const fullAudioUrl = music.audioUrl.startsWith('http') 
        ? music.audioUrl 
        : `${BACKEND_URL}${music.audioUrl}`;
      audioRef.current.src = fullAudioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentMusic) return;
    const currentIndex = musics.findIndex(m => m.id === currentMusic.id);
    const nextMusic = musics[(currentIndex + 1) % musics.length];
    playMusic(nextMusic);
  };

  const playPrevious = () => {
    if (!currentMusic) return;
    const currentIndex = musics.findIndex(m => m.id === currentMusic.id);
    const prevMusic = musics[(currentIndex - 1 + musics.length) % musics.length];
    playMusic(prevMusic);
  };

  const seekTo = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleFavorite = (musicId) => {
    setUser(prev => {
      const isFavorited = prev.favoriteIds.includes(musicId);
      return {
        ...prev,
        favoriteIds: isFavorited
          ? prev.favoriteIds.filter(id => id !== musicId)
          : [...prev.favoriteIds, musicId]
      };
    });
  };

  const createPlaylist = (name, description) => {
    const newPlaylist = {
      id: `p${Date.now()}`,
      name,
      description,
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
      musicIds: [],
      userId: user.id
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const addToPlaylist = (playlistId, musicId) => {
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId && !p.musicIds.includes(musicId)
        ? { ...p, musicIds: [...p.musicIds, musicId] }
        : p
    ));
  };

  const removeFromPlaylist = (playlistId, musicId) => {
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId
        ? { ...p, musicIds: p.musicIds.filter(id => id !== musicId) }
        : p
    ));
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
  };

  return (
    <MusicContext.Provider value={{
      musics,
      playlists,
      user,
      currentMusic,
      isPlaying,
      currentTime,
      duration,
      volume,
      playMusic,
      togglePlay,
      playNext,
      playPrevious,
      seekTo,
      setVolume,
      toggleFavorite,
      createPlaylist,
      addToPlaylist,
      removeFromPlaylist,
      deletePlaylist
    }}>
      {children}
    </MusicContext.Provider>
  );
};
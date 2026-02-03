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

  const toggleFavorite = async (musicId) => {
    try {
      await axios.post(`${API}/favorite/${musicId}`, {}, {
        headers: getAuthHeader()
      });
      // Refresh user data would happen via AuthContext
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const createPlaylist = async (name, description) => {
    try {
      const response = await axios.post(`${API}/playlist`, {
        name,
        description
      }, {
        headers: getAuthHeader()
      });
      setPlaylists(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Failed to create playlist:', error);
      return null;
    }
  };

  const addToPlaylist = async (playlistId, musicId) => {
    try {
      const response = await axios.post(
        `${API}/playlist/${playlistId}/add`,
        { musicId },
        { headers: getAuthHeader() }
      );
      setPlaylists(prev => prev.map(p => 
        p.id === playlistId ? response.data : p
      ));
    } catch (error) {
      console.error('Failed to add to playlist:', error);
    }
  };

  const removeFromPlaylist = async (playlistId, musicId) => {
    try {
      const response = await axios.delete(
        `${API}/playlist/${playlistId}/remove/${musicId}`,
        { headers: getAuthHeader() }
      );
      setPlaylists(prev => prev.map(p => 
        p.id === playlistId ? response.data : p
      ));
    } catch (error) {
      console.error('Failed to remove from playlist:', error);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`${API}/playlist/${playlistId}`, {
        headers: getAuthHeader()
      });
      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
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
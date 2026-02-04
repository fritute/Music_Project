import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useMusicContext } from '../context/MusicContext';
import { Slider } from './ui/slider';

const Player = () => {
  const {
    currentMusic,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setVolume
  } = useMusicContext();

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentMusic) {
    return (
      <div className="h-24 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 flex items-center justify-center">
        <p className="text-gray-500">Selecione uma música para começar</p>
      </div>
    );
  }

  return (
    <div className="h-24 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 px-4 flex items-center justify-between">
      {/* Current Music Info */}
      <div className="flex items-center space-x-4 w-1/4">
        <img
          src={currentMusic.coverUrl}
          alt={currentMusic.title}
          className="w-14 h-14 rounded-lg shadow-lg"
        />
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">{currentMusic.title}</p>
          <p className="text-gray-400 text-sm truncate">{currentMusic.artist}</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center space-y-2 w-2/4">
        <div className="flex items-center space-x-4">
          <button
            onClick={playPrevious}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:scale-105 transition-transform duration-200"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-black" />
            ) : (
              <Play className="w-5 h-5 text-black ml-0.5" />
            )}
          </button>
          <button
            onClick={playNext}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-2 w-full max-w-2xl">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueCommit={(value) => seekTo(value[0])}
            className="flex-1"
          />
          <span className="text-xs text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2 w-1/4 justify-end">
        {volume === 0 ? (
          <VolumeX className="w-5 h-5 text-gray-400" />
        ) : (
          <Volume2 className="w-5 h-5 text-gray-400" />
        )}
        <Slider
          value={[volume * 100]}
          max={100}
          step={1}
          onValueChange={(value) => setVolume(value[0] / 100)}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default Player;
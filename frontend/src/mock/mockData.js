// Mock data para desenvolvimento inicial
export const mockMusics = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    genre: 'Pop',
    duration: 200,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '2',
    title: 'Levitating',
    artist: 'Dua Lipa',
    genre: 'Pop',
    duration: 203,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '3',
    title: 'Peaches',
    artist: 'Justin Bieber',
    genre: 'R&B',
    duration: 198,
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: '4',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    genre: 'Pop',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: '5',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    genre: 'Pop Rock',
    duration: 178,
    coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: '6',
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    genre: 'Pop',
    duration: 141,
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  },
  {
    id: '7',
    title: 'Drivers License',
    artist: 'Olivia Rodrigo',
    genre: 'Pop',
    duration: 242,
    coverUrl: 'https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
  },
  {
    id: '8',
    title: 'Kiss Me More',
    artist: 'Doja Cat ft. SZA',
    genre: 'R&B',
    duration: 208,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  }
];

export const mockPlaylists = [
  {
    id: 'p1',
    name: 'Meus Favoritos',
    description: 'Minhas músicas preferidas',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    musicIds: ['1', '3', '5'],
    userId: 'user1'
  },
  {
    id: 'p2',
    name: 'Treino',
    description: 'Energizantes para malhar',
    coverUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop',
    musicIds: ['2', '4', '6'],
    userId: 'user1'
  }
];

export const mockUser = {
  id: 'user1',
  name: 'Usuário Demo',
  email: 'demo@music.com',
  favoriteIds: ['1', '2', '5'],
  stats: {
    totalListened: 145,
    topGenre: 'Pop',
    topArtist: 'The Weeknd'
  }
};
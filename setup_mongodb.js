/* global use, db */
// MongoDB Setup para MusicStream Project
// Este script configura o banco de dados para o projeto MusicStream

// ====================================
// 1. SELECIONAR O BANCO DE DADOS
// ====================================
use('musicstream');

console.log('🎵 Configurando banco de dados MusicStream...');

// ====================================
// 2. LIMPAR DADOS EXISTENTES (APENAS EM DESENVOLVIMENTO)
// ====================================
console.log('🗑️  Limpando dados anteriores...');
db.users.deleteMany({});
db.music.deleteMany({});
db.playlists.deleteMany({});

// ====================================
// 3. CRIAR ÍNDICES PARA PERFORMANCE
// ====================================
console.log('📊 Criando índices...');

// Índices para usuários
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

// Índices para músicas
db.music.createIndex({ "title": "text", "artist": "text" }); // Busca textual
db.music.createIndex({ "artist": 1 });
db.music.createIndex({ "genre": 1 });
db.music.createIndex({ "uploadedBy": 1 });
db.music.createIndex({ "createdAt": 1 });

// Índices para playlists
db.playlists.createIndex({ "userId": 1 });
db.playlists.createIndex({ "createdAt": 1 });

// ====================================
// 4. INSERIR DADOS DE TESTE
// ====================================
console.log('👤 Criando usuário de teste...');

// Usuário de teste
const testUser = db.users.insertOne({
  "name": "Gustavo Dev",
  "email": "gustavo@musicstream.com",
  "password": "$2b$12$LQv3c1yqBwEHFl5ghSQHQeH5wPWzV1h5V8E65z4k5p5l8p5l8p5l8", // Senha: musicstream123
  "favoriteIds": [],
  "createdAt": new Date()
});

console.log('🎵 Inserindo músicas de exemplo...');

// Músicas de teste
const musics = db.music.insertMany([
  {
    "title": "Bohemian Rhapsody",
    "artist": "Queen",
    "genre": "Rock",
    "duration": 355,
    "coverUrl": "https://via.placeholder.com/300x300?text=Queen",
    "audioUrl": "uploads/music/bohemian_rhapsody.mp3",
    "uploadedBy": testUser.insertedId,
    "createdAt": new Date()
  },
  {
    "title": "Imagine",
    "artist": "John Lennon",
    "genre": "Folk Rock",
    "duration": 183,
    "coverUrl": "https://via.placeholder.com/300x300?text=Imagine",
    "audioUrl": "uploads/music/imagine.mp3",
    "uploadedBy": testUser.insertedId,
    "createdAt": new Date()
  },
  {
    "title": "Billie Jean",
    "artist": "Michael Jackson",
    "genre": "Pop",
    "duration": 294,
    "coverUrl": "https://via.placeholder.com/300x300?text=MJ",
    "audioUrl": "uploads/music/billie_jean.mp3",
    "uploadedBy": testUser.insertedId,
    "createdAt": new Date()
  },
  {
    "title": "Hotel California",
    "artist": "Eagles",
    "genre": "Rock",
    "duration": 391,
    "coverUrl": "https://via.placeholder.com/300x300?text=Eagles",
    "audioUrl": "uploads/music/hotel_california.mp3",
    "uploadedBy": testUser.insertedId,
    "createdAt": new Date()
  },
  {
    "title": "Stairway to Heaven",
    "artist": "Led Zeppelin",
    "genre": "Rock",
    "duration": 482,
    "coverUrl": "https://via.placeholder.com/300x300?text=Led+Zeppelin",
    "audioUrl": "uploads/music/stairway_to_heaven.mp3",
    "uploadedBy": testUser.insertedId,
    "createdAt": new Date()
  }
]);

console.log('📁 Criando playlists de exemplo...');

// Playlists de teste
const playlists = db.playlists.insertMany([
  {
    "name": "Rock Clássico",
    "description": "As melhores do rock de todos os tempos",
    "userId": testUser.insertedId,
    "musicIds": [musics.insertedIds[0], musics.insertedIds[3], musics.insertedIds[4]],
    "createdAt": new Date()
  },
  {
    "name": "Favoritas",
    "description": "Minhas músicas favoritas",
    "userId": testUser.insertedId,
    "musicIds": [musics.insertedIds[1], musics.insertedIds[2]],
    "createdAt": new Date()
  }
]);

// Adicionar algumas músicas aos favoritos do usuário
db.users.updateOne(
  { "_id": testUser.insertedId },
  { 
    "$set": { 
      "favoriteIds": [musics.insertedIds[1], musics.insertedIds[2], musics.insertedIds[0]]
    }
  }
);

// ====================================
// 5. VERIFICAR CONFIGURAÇÃO
// ====================================
console.log('✅ Verificando dados inseridos...');

const userCount = db.users.countDocuments();
const musicCount = db.music.countDocuments();
const playlistCount = db.playlists.countDocuments();

console.log(`📊 Estatísticas:
- Usuários: ${userCount}
- Músicas: ${musicCount}  
- Playlists: ${playlistCount}`);

// ====================================
// 6. CONSULTAS DE TESTE
// ====================================
console.log('🧪 Executando consultas de teste...');

// Buscar usuário por email
const user = db.users.findOne({ email: "gustavo@musicstream.com" });
console.log('👤 Usuário encontrado:', user?.name);

// Buscar músicas por gênero
const rockSongs = db.music.find({ genre: "Rock" }).toArray();
console.log('🎸 Músicas de Rock:', rockSongs.length);

// Buscar playlists do usuário
const userPlaylists = db.playlists.find({ userId: testUser.insertedId }).toArray();
console.log('📁 Playlists do usuário:', userPlaylists.length);

console.log('🎉 Banco de dados MusicStream configurado com sucesso!');
console.log('🚀 Agora você pode iniciar o backend: python server.py');
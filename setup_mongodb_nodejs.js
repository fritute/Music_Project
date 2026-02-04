// MongoDB Setup para MusicStream Project (Node.js version)
// Execute com: node setup_mongodb_nodejs.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

// Configuração da conexão
const uri = process.env.MONGO_URL || "mongodb+srv://musicstream:RdV41Cva0xfOa1ig@music.o9m32st.mongodb.net/musicstream?retryWrites=true&w=majority";
const dbName = process.env.DB_NAME || "musicstream";

async function setupMusicStreamDB() {
    console.log('🎵 Configurando banco de dados MusicStream...');
    
    const client = new MongoClient(uri);
    
    try {
        // Conectar ao MongoDB
        await client.connect();
        console.log('✅ Conectado ao MongoDB Atlas');
        
        const db = client.db(dbName);
        
        // ====================================
        // 1. LIMPAR DADOS EXISTENTES (APENAS EM DESENVOLVIMENTO)
        // ====================================
        console.log('🗑️  Limpando dados anteriores...');
        await db.collection('users').deleteMany({});
        await db.collection('music').deleteMany({});
        await db.collection('playlists').deleteMany({});
        
        // ====================================
        // 2. CRIAR ÍNDICES PARA PERFORMANCE
        // ====================================
        console.log('📊 Criando índices...');
        
        // Índices para usuários
        await db.collection('users').createIndex({ "email": 1 }, { unique: true });
        await db.collection('users').createIndex({ "createdAt": 1 });
        
        // Índices para músicas
        await db.collection('music').createIndex({ 
            "title": "text", 
            "artist": "text" 
        });
        await db.collection('music').createIndex({ "artist": 1 });
        await db.collection('music').createIndex({ "genre": 1 });
        await db.collection('music').createIndex({ "uploadedBy": 1 });
        await db.collection('music').createIndex({ "createdAt": 1 });
        
        // Índices para playlists
        await db.collection('playlists').createIndex({ "userId": 1 });
        await db.collection('playlists').createIndex({ "createdAt": 1 });
        
        // ====================================
        // 3. INSERIR DADOS DE TESTE
        // ====================================
        console.log('👤 Criando usuário de teste...');
        
        // Usuário de teste
        const testUserResult = await db.collection('users').insertOne({
            "name": "Gustavo Dev",
            "email": "gustavo@musicstream.com",
            "password": "$2b$12$LQv3c1yqBwEHFl5ghSQHQeH5wPWzV1h5V8E65z4k5p5l8p5l8p5l8", // Senha: musicstream123
            "favoriteIds": [],
            "createdAt": new Date()
        });
        
        console.log('🎵 Inserindo músicas de exemplo...');
        
        // Músicas de teste
        const musicsResult = await db.collection('music').insertMany([
            {
                "title": "Bohemian Rhapsody",
                "artist": "Queen",
                "genre": "Rock",
                "duration": 355,
                "coverUrl": "https://via.placeholder.com/300x300?text=Queen",
                "audioUrl": "uploads/music/bohemian_rhapsody.mp3",
                "uploadedBy": testUserResult.insertedId,
                "createdAt": new Date()
            },
            {
                "title": "Imagine",
                "artist": "John Lennon",
                "genre": "Folk Rock",
                "duration": 183,
                "coverUrl": "https://via.placeholder.com/300x300?text=Imagine",
                "audioUrl": "uploads/music/imagine.mp3",
                "uploadedBy": testUserResult.insertedId,
                "createdAt": new Date()
            },
            {
                "title": "Billie Jean",
                "artist": "Michael Jackson",
                "genre": "Pop",
                "duration": 294,
                "coverUrl": "https://via.placeholder.com/300x300?text=MJ",
                "audioUrl": "uploads/music/billie_jean.mp3",
                "uploadedBy": testUserResult.insertedId,
                "createdAt": new Date()
            },
            {
                "title": "Hotel California",
                "artist": "Eagles",
                "genre": "Rock",
                "duration": 391,
                "coverUrl": "https://via.placeholder.com/300x300?text=Eagles",
                "audioUrl": "uploads/music/hotel_california.mp3",
                "uploadedBy": testUserResult.insertedId,
                "createdAt": new Date()
            },
            {
                "title": "Stairway to Heaven",
                "artist": "Led Zeppelin",
                "genre": "Rock",
                "duration": 482,
                "coverUrl": "https://via.placeholder.com/300x300?text=Led+Zeppelin",
                "audioUrl": "uploads/music/stairway_to_heaven.mp3",
                "uploadedBy": testUserResult.insertedId,
                "createdAt": new Date()
            }
        ]);
        
        console.log('📁 Criando playlists de exemplo...');
        
        // Playlists de teste
        const musicIds = Object.values(musicsResult.insertedIds);
        await db.collection('playlists').insertMany([
            {
                "name": "Rock Clássico",
                "description": "As melhores do rock de todos os tempos",
                "userId": testUserResult.insertedId,
                "musicIds": [musicIds[0], musicIds[3], musicIds[4]],
                "createdAt": new Date()
            },
            {
                "name": "Favoritas",
                "description": "Minhas músicas favoritas",
                "userId": testUserResult.insertedId,
                "musicIds": [musicIds[1], musicIds[2]],
                "createdAt": new Date()
            }
        ]);
        
        // Adicionar algumas músicas aos favoritos do usuário
        await db.collection('users').updateOne(
            { "_id": testUserResult.insertedId },
            { 
                "$set": { 
                    "favoriteIds": [musicIds[1], musicIds[2], musicIds[0]]
                }
            }
        );
        
        // ====================================
        // 4. VERIFICAR CONFIGURAÇÃO
        // ====================================
        console.log('✅ Verificando dados inseridos...');
        
        const userCount = await db.collection('users').countDocuments();
        const musicCount = await db.collection('music').countDocuments();
        const playlistCount = await db.collection('playlists').countDocuments();
        
        console.log(`📊 Estatísticas:
- Usuários: ${userCount}
- Músicas: ${musicCount}  
- Playlists: ${playlistCount}`);
        
        // ====================================
        // 5. CONSULTAS DE TESTE
        // ====================================
        console.log('🧪 Executando consultas de teste...');
        
        // Buscar usuário por email
        const user = await db.collection('users').findOne({ email: "gustavo@musicstream.com" });
        console.log('👤 Usuário encontrado:', user?.name);
        
        // Buscar músicas por gênero
        const rockSongs = await db.collection('music').find({ genre: "Rock" }).toArray();
        console.log('🎸 Músicas de Rock:', rockSongs.length);
        
        // Buscar playlists do usuário
        const userPlaylists = await db.collection('playlists').find({ userId: testUserResult.insertedId }).toArray();
        console.log('📁 Playlists do usuário:', userPlaylists.length);
        
        console.log('🎉 Banco de dados MusicStream configurado com sucesso!');
        console.log('🚀 Agora você pode iniciar o backend: python server.py');
        
    } catch (error) {
        console.error('❌ Erro ao configurar banco de dados:', error);
    } finally {
        // Fechar conexão
        await client.close();
        console.log('🔌 Conexão MongoDB fechada');
    }
}

// Executar setup
setupMusicStreamDB().catch(console.error);
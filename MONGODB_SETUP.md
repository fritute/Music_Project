# Configuração MongoDB - MusicStream Project

## 📋 Visão Geral do Projeto

O **MusicStream** é um sistema de streaming de música completo, composto por:
- **Backend**: API em FastAPI com Python
- **Frontend**: React.js com Tailwind CSS
- **Banco de Dados**: MongoDB
- **Storage**: Sistema de arquivos local para MP3 e capas

## 🗄️ Estrutura do Banco de Dados

### Collections Necessárias

O banco de dados `musicstream` contém 3 collections principais:

#### 1. **users** - Usuários do Sistema
```javascript
{
  "_id": ObjectId,
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed com bcrypt)",
  "favoriteIds": [ObjectId], // Referências para músicas favoritas
  "createdAt": Date
}
```

#### 2. **music** - Catálogo de Músicas
```javascript
{
  "_id": ObjectId,
  "title": "string",
  "artist": "string", 
  "genre": "string",
  "duration": Number, // Duração em segundos
  "coverUrl": "string", // URL/caminho da capa (opcional)
  "audioUrl": "string", // Caminho do arquivo MP3
  "uploadedBy": ObjectId, // Referência ao usuário que fez upload
  "createdAt": Date
}
```

#### 3. **playlists** - Playlists dos Usuários
```javascript
{
  "_id": ObjectId,
  "name": "string",
  "description": "string",
  "userId": ObjectId, // Referência ao proprietário
  "musicIds": [ObjectId], // Array de referências para músicas
  "createdAt": Date
}
```

## 🛠️ Configuração do MongoDB

### 1. Instalação do MongoDB

#### **Opção A: MongoDB Atlas (Cloud - Recomendado)**
1. Acesse [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie uma conta gratuita
3. Crie um novo cluster
4. Configure acesso de rede (IP Whitelist)
5. Crie um usuário de banco de dados
6. Obtenha a string de conexão

#### **Opção B: MongoDB Local**
```bash
# Windows - Download e instale pelo site oficial
# https://www.mongodb.com/try/download/community

# macOS
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### 2. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/`:

```env
# MongoDB Configuration
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
# Para local: mongodb://localhost:27017
DB_NAME=musicstream

# JWT Configuration
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_ALGORITHM=HS256

# Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800  # 50MB em bytes
```

### 3. Scripts de Inicialização do Banco

#### **Script para criar índices (Opcional mas recomendado)**

```javascript
// execute no MongoDB Shell ou MongoDB Compass

use musicstream;

// Índices para otimizar consultas
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

db.music.createIndex({ "title": "text", "artist": "text" }); // Busca textual
db.music.createIndex({ "artist": 1 });
db.music.createIndex({ "genre": 1 });
db.music.createIndex({ "uploadedBy": 1 });
db.music.createIndex({ "createdAt": 1 });

db.playlists.createIndex({ "userId": 1 });
db.playlists.createIndex({ "createdAt": 1 });
```

#### **Script para dados de exemplo (Desenvolvimento)**

```javascript
// execute no MongoDB Shell ou MongoDB Compass

use musicstream;

// Limpar collections (apenas em desenvolvimento)
db.users.deleteMany({});
db.music.deleteMany({});
db.playlists.deleteMany({});

// Inserir usuário de teste
const testUser = db.users.insertOne({
  "name": "Usuário Teste",
  "email": "teste@musicstream.com",
  "password": "$2b$12$exemplo_hash_bcrypt_aqui", // Senha: teste123
  "favoriteIds": [],
  "createdAt": new Date()
});

// Inserir algumas músicas de exemplo
const music1 = db.music.insertOne({
  "title": "Música Teste 1",
  "artist": "Artista Teste",
  "genre": "Pop",
  "duration": 210, // 3:30
  "coverUrl": null,
  "audioUrl": "uploads/music/test1.mp3",
  "uploadedBy": testUser.insertedId,
  "createdAt": new Date()
});

const music2 = db.music.insertOne({
  "title": "Música Teste 2", 
  "artist": "Outro Artista",
  "genre": "Rock",
  "duration": 185, // 3:05
  "coverUrl": null,
  "audioUrl": "uploads/music/test2.mp3",
  "uploadedBy": testUser.insertedId,
  "createdAt": new Date()
});

// Inserir playlist de exemplo
db.playlists.insertOne({
  "name": "Minha Playlist Teste",
  "description": "Playlist de teste para desenvolvimento",
  "userId": testUser.insertedId,
  "musicIds": [music1.insertedId, music2.insertedId],
  "createdAt": new Date()
});

console.log("Dados de teste inseridos com sucesso!");
```

## 🚀 Iniciando o Sistema

### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python server.py
```

### 2. Frontend (React)
```bash
cd frontend
npm install
npm start
```

### 3. Verificação da Conexão

Teste a API:
```bash
# Health check
curl http://localhost:8000/api/

# Deve retornar:
{"message": "MusicStream API is running", "status": "healthy"}
```

## 📊 Consultas Úteis MongoDB

### Estatísticas do Sistema
```javascript
// Total de usuários
db.users.countDocuments();

// Total de músicas
db.music.countDocuments();

// Músicas por gênero
db.music.aggregate([
  { $group: { _id: "$genre", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// Usuários mais ativos (mais uploads)
db.music.aggregate([
  { $group: { _id: "$uploadedBy", uploads: { $sum: 1 } } },
  { $sort: { uploads: -1 } },
  { $limit: 10 }
]);
```

### Manutenção
```javascript
// Limpar músicas órfãs (sem arquivo físico)
db.music.find({ audioUrl: { $exists: true } });

// Remover playlists vazias
db.playlists.deleteMany({ musicIds: { $size: 0 } });
```

## 🔒 Segurança e Backup

### Configurações de Segurança
1. **Nunca** commite credenciais no código
2. Use variáveis de ambiente para todas as configurações sensíveis
3. Configure acesso de rede restrito no MongoDB Atlas
4. Implemente rate limiting na API
5. Use HTTPS em produção

### Backup Automático
```bash
# Backup local
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/musicstream" --out ./backups/

# Restaurar backup
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/musicstream" ./backups/musicstream/
```

## 📈 Monitoramento

### Métricas Importantes
- Conexões ativas ao MongoDB
- Tempo de resposta das consultas
- Espaço em disco usado pelos uploads
- Taxa de crescimento de usuários e músicas

### Tools Recomendadas
- **MongoDB Compass**: Interface gráfica
- **MongoDB Atlas Monitoring**: Para clusters na nuvem
- **Logs do FastAPI**: Para debug da aplicação

---

## ✅ Checklist de Configuração

- [ ] MongoDB instalado/configurado
- [ ] Banco `musicstream` criado
- [ ] Arquivo `.env` configurado
- [ ] Índices criados
- [ ] Dados de teste inseridos (opcional)
- [ ] API Backend rodando
- [ ] Frontend conectando com sucesso
- [ ] Upload de arquivos funcionando
- [ ] Autenticação JWT operacional

## 🆘 Troubleshooting

### Problemas Comuns

1. **Erro de conexão MongoDB**
   - Verifique a string de conexão
   - Confirme IP whitelist (Atlas)
   - Teste conectividade de rede

2. **Uploads não funcionam**
   - Verifique permissões da pasta `uploads/`
   - Confirme limite de tamanho de arquivo
   - Verifique espaço em disco

3. **JWT Token inválido**
   - Confirme `JWT_SECRET` no `.env`
   - Verifique expiração do token
   - Debug headers de autenticação

---

*Este documento deve ser atualizado conforme o projeto evolui. Mantenha sempre atualizada a estrutura do banco de dados e as configurações de ambiente.*
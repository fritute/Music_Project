# Contratos de Integração - MusicStream

## 1. DADOS MOCKADOS (Frontend) → SUBSTITUIR POR API

### Mock Data em `/app/frontend/src/mock/mockData.js`:
- `mockMusics`: Lista de músicas → API GET /api/musics
- `mockPlaylists`: Playlists do usuário → API GET /api/playlists
- `mockUser`: Dados do usuário → API GET /api/user/me

## 2. MODELS BACKEND (MongoDB)

### User
```
- _id: ObjectId
- name: string
- email: string (unique)
- password: string (hashed)
- favoriteIds: [ObjectId] (referência para Music)
- createdAt: Date
```

### Music
```
- _id: ObjectId
- title: string
- artist: string
- genre: string
- duration: number (segundos)
- coverUrl: string
- audioUrl: string (caminho do arquivo MP3)
- uploadedBy: ObjectId (referência User)
- createdAt: Date
```

### Playlist
```
- _id: ObjectId
- name: string
- description: string
- userId: ObjectId (referência User)
- musicIds: [ObjectId] (referência Music)
- createdAt: Date
```

## 3. API ENDPOINTS

### AUTH
- POST /api/auth/register → Registro de usuário
- POST /api/auth/login → Login (retorna JWT token)
- GET /api/auth/me → Dados do usuário logado

### MUSIC
- POST /api/music/upload → Upload de MP3 (multipart/form-data)
- GET /api/music → Listar todas músicas
- GET /api/music/:id → Detalhes de uma música
- DELETE /api/music/:id → Deletar música (apenas quem fez upload)
- GET /api/music/stream/:id → Stream do arquivo MP3

### PLAYLIST
- POST /api/playlist → Criar playlist
- GET /api/playlist → Listar playlists do usuário
- GET /api/playlist/:id → Detalhes da playlist
- PUT /api/playlist/:id → Atualizar playlist
- DELETE /api/playlist/:id → Deletar playlist
- POST /api/playlist/:id/add → Adicionar música
- DELETE /api/playlist/:id/remove → Remover música

### FAVORITE
- POST /api/favorite/:musicId → Adicionar/remover favorito (toggle)
- GET /api/favorite → Listar músicas favoritas

## 4. FRONTEND INTEGRATION CHANGES

### Context (MusicContext.js)
- Substituir dados mock por chamadas axios
- Adicionar AuthContext para gerenciar token JWT
- Salvar token no localStorage
- Adicionar headers Authorization em todas requisições

### Arquivos a modificar:
1. Criar `AuthContext.js` - gerenciar login/logout
2. Atualizar `MusicContext.js` - usar APIs reais
3. Criar páginas `Login.js` e `Register.js`
4. Criar componente `UploadMusic.js`
5. Proteger rotas com PrivateRoute

## 5. STORAGE DE ARQUIVOS

- Pasta: `/app/backend/uploads/`
  - `/app/backend/uploads/music/` → arquivos MP3
  - `/app/backend/uploads/covers/` → capas (opcional)
- Multer para processar upload
- Servir arquivos estáticos via Express

## 6. SEGURANÇA

- Passwords: bcrypt hash
- JWT: secret em .env
- Upload: validar tipo MIME (audio/mpeg, audio/mp3)
- File size limit: 50MB por arquivo
- Autenticação obrigatória em rotas protegidas

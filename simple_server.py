from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configurar MongoDB
mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.getenv('DB_NAME', 'musicstream')

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Criar aplicação FastAPI
app = FastAPI(title="MusicStream API", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "MusicStream API is running", "status": "healthy"}

@app.get("/api/")
async def api_root():
    return {"message": "MusicStream API is running", "status": "healthy"}

@app.get("/api/test-db")
async def test_database():
    try:
        # Testar conexão com o banco
        server_info = await client.admin.command('hello')
        
        # Contar documentos nas collections
        user_count = await db.users.count_documents({})
        music_count = await db.music.count_documents({})
        playlist_count = await db.playlists.count_documents({})
        
        return {
            "status": "success",
            "message": "Conexão com MongoDB funcionando!",
            "database": db_name,
            "collections": {
                "users": user_count,
                "music": music_count,
                "playlists": playlist_count
            },
            "server_info": server_info.get('me', 'Connected')
        }
    except Exception as e:
        return {
            "status": "error", 
            "message": f"Erro na conexão: {str(e)}"
        }

@app.get("/api/users")
async def get_users():
    try:
        users = await db.users.find({}, {"password": 0}).limit(10).to_list(10)
        for user in users:
            user["_id"] = str(user["_id"])
        return {"users": users, "count": len(users)}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/music")  
async def get_music():
    try:
        musics = await db.music.find({}).limit(10).to_list(10)
        for music in musics:
            music["_id"] = str(music["_id"])
            if music.get("uploadedBy"):
                music["uploadedBy"] = str(music["uploadedBy"])
        return {"music": musics, "count": len(musics)}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
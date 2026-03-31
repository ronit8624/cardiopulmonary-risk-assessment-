from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import heart, lung

app = FastAPI(title="Cardiopulmonary Risk Assessment API")

# CORS - React frontend se connect karne ke liye
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(heart.router, prefix="/predict", tags=["Heart"])
app.include_router(lung.router, prefix="/predict", tags=["Lung"])

@app.get("/")
def home():
    return {"message": "Cardiopulmonary Risk Assessment API is running!"}
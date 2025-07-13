from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import auth, prompts  # Import the new auth router

# Create the FastAPI app instance
app = FastAPI(title="AI Teacher Toolkit API")

# --- Middleware ---
# This is important for allowing your front end (running on a different "origin")
# to communicate with your back end.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- API Endpoints (Routes) ---
@app.get("/api/health")
def read_health_check():
    """A simple endpoint to check if the API is running."""
    return {"status": "API is running"}


# --- Serve the Frontend ---
# This line tells FastAPI to serve the static files (HTML, CSS, JS) from your frontend folder.
# The path is relative to where you run the `uvicorn` command.
# For this structure, you'd run it from the root `ai-teacher-toolkit` directory.
# Note: For production, you might serve this with a web server like Nginx instead.

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])


app.include_router(prompts.router, prefix="/api/prompts", tags=["Prompts"])

app.mount("/", StaticFiles(directory="frontend", html=True), name="static")

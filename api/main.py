from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import questions, sessions, answers, progress

app = FastAPI(
    title="my.py API",
    description="Python Certification Learning Tool",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(questions.router, prefix="/api/questions", tags=["questions"])
app.include_router(sessions.router,  prefix="/api/sessions",  tags=["sessions"])
app.include_router(answers.router,   prefix="/api/answers",   tags=["answers"])
app.include_router(progress.router,  prefix="/api/progress",  tags=["progress"])

@app.get("/health")
def health():
    return {"status": "ok", "version": "0.1.0"}

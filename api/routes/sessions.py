import uuid
import datetime
from fastapi import APIRouter, Depends
from api.models.schemas import SessionCreate, SessionResponse
from api.models.database import get_db

router = APIRouter()

@router.post("", response_model=SessionResponse)
def create_session(body: SessionCreate, db=Depends(get_db)):
    session_id = str(uuid.uuid4())
    now = datetime.datetime.utcnow().isoformat()
    db.execute(
        "INSERT INTO sessions (id, started_at, certification) VALUES (?, ?, ?)",
        (session_id, now, body.certification)
    )
    db.commit()
    return SessionResponse(session_id=session_id, started_at=now)

@router.patch("/{session_id}")
def close_session(session_id: str, db=Depends(get_db)):
    now = datetime.datetime.utcnow().isoformat()
    db.execute(
        "UPDATE sessions SET ended_at = ? WHERE id = ?",
        (now, session_id)
    )
    db.commit()
    return {"status": "closed"}

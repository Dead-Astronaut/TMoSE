from fastapi import APIRouter, Depends
from api.models.database import get_db

router = APIRouter()

@router.get("")
def get_progress(db=Depends(get_db)):
    sessions = db.execute("SELECT * FROM sessions").fetchall()
    answers = db.execute("SELECT * FROM answers").fetchall()
    total_correct = sum(1 for a in answers if a["is_correct"])
    total_answered = len(answers)
    
    return {
        "total_sessions": len(sessions),
        "total_answered": total_answered,
        "total_correct": total_correct,
        "accuracy": round(total_correct / total_answered * 100, 1) if total_answered else 0,
        "streak": 0,  # TODO M3
        "weekly_minutes": 0,  # TODO M3
    }

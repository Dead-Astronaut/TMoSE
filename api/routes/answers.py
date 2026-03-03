import os
import json
import datetime
from fastapi import APIRouter, Depends, HTTPException
from api.models.schemas import AnswerSubmit, AnswerResult
from api.models.database import get_db

router = APIRouter()


def _find_question(question_id: str) -> dict | None:
    for cert in ["pcep", "pcap", "pcpp1", "pcei"]:
        path = f"questions/{cert}.json"
        if not os.path.exists(path):
            continue
        with open(path) as f:
            data = json.load(f)
        for q in data.get("questions", []):
            if q["id"] == question_id:
                return q
    return None


@router.post("", response_model=AnswerResult)
def submit_answer(body: AnswerSubmit, db=Depends(get_db)):
    question = _find_question(body.question_id)
    if not question:
        raise HTTPException(status_code=404, detail=f"Question {body.question_id} not found")

    is_correct = body.user_answer.strip().lower() == question["correct_answer"].strip().lower()

    now = datetime.datetime.utcnow().isoformat()
    try:
        db.execute(
            "INSERT INTO answers (session_id, question_id, user_answer, is_correct, answered_at) VALUES (?, ?, ?, ?, ?)",
            (body.session_id, body.question_id, body.user_answer, int(is_correct), now),
        )
        db.commit()
    except Exception:
        pass  # don't fail the response if DB write fails

    return AnswerResult(
        is_correct=is_correct,
        explanation=question["explanation"],
        correct_answer=question["correct_answer"],
    )

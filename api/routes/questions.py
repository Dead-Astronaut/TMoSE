import json
import os
from fastapi import APIRouter, HTTPException, Query
from api.models.schemas import Question, AnswerSubmit, AnswerResult
from typing import Optional
import datetime

router = APIRouter()

def load_questions(certification: str) -> list:
    path = f"questions/{certification.lower()}.json"
    if not os.path.exists(path):
        return []
    with open(path) as f:
        data = json.load(f)
    return data.get("questions", [])

@router.get("/next")
def get_next_question(
    certification: str = Query(...),
    section: Optional[str] = Query(None),
    difficulty: int = Query(1),
):
    questions = load_questions(certification)
    if not questions:
        raise HTTPException(404, f"No questions found for {certification}")
    
    filtered = [q for q in questions if q["difficulty"] == difficulty]
    if section:
        filtered = [q for q in filtered if q["section"] == section]
    if not filtered:
        filtered = questions  # fallback to all
    
    import random
    return random.choice(filtered)

@router.post("/answer", response_model=AnswerResult)
def submit_answer(body: AnswerSubmit):
    # Load questions to find the right answer
    for cert in ["pcep", "pcap", "pcpp1", "pcei"]:
        path = f"questions/{cert}.json"
        if not os.path.exists(path):
            continue
        with open(path) as f:
            data = json.load(f)
        questions = {q["id"]: q for q in data.get("questions", [])}
        if body.question_id in questions:
            q = questions[body.question_id]
            is_correct = body.user_answer.strip().lower() == q["correct_answer"].strip().lower()
            return AnswerResult(
                is_correct=is_correct,
                explanation=q["explanation"],
                correct_answer=q["correct_answer"],
            )
    raise HTTPException(404, f"Question {body.question_id} not found")

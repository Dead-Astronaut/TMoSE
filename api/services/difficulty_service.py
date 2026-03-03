from sqlalchemy.orm import Session as DBSession
from api.models.database import Answer, Progress
from datetime import datetime


def get_current_difficulty(db: DBSession, certification: str, section: str) -> int:
    prog = db.query(Progress).filter_by(
        certification=certification, section=section
    ).first()
    return prog.current_difficulty if prog else 1


def update_difficulty(db: DBSession, certification: str, section: str, objective: str, is_correct: bool):
    prog = db.query(Progress).filter_by(
        certification=certification, section=section, objective=objective
    ).first()

    if not prog:
        prog = Progress(
            certification=certification,
            section=section,
            objective=objective,
            current_difficulty=1,
            mastery_status="in_progress",
        )
        db.add(prog)

    prog.questions_seen += 1
    if is_correct:
        prog.correct_count += 1
    prog.last_seen_at = datetime.utcnow()

    # Check last 3 answers for this objective
    recent = (
        db.query(Answer)
        .join(Answer.session_id == Answer.session_id)
        .filter(Answer.question_id.like(f"{certification.lower()}-{section}%"))
        .order_by(Answer.answered_at.desc())
        .limit(3)
        .all()
    )

    # Simple consecutive tracking via questions_seen / correct_count
    total = prog.questions_seen
    correct = prog.correct_count

    if total >= 3:
        rate = correct / total
        if rate >= 0.9 and prog.current_difficulty < 3:
            prog.current_difficulty = min(3, prog.current_difficulty + 1)
        elif rate <= 0.4 and prog.current_difficulty > 1:
            prog.current_difficulty = max(1, prog.current_difficulty - 1)

    # Update mastery
    if prog.correct_count >= 5 and (prog.correct_count / prog.questions_seen) >= 0.8:
        prog.mastery_status = "mastered"
    elif prog.questions_seen > 0:
        prog.mastery_status = "in_progress"

    db.commit()
    return prog.current_difficulty

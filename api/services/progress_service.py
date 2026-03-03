from sqlalchemy.orm import Session as DBSession
from api.models.database import Answer, Session as SessionModel, Progress
from datetime import datetime, timedelta


def get_streak(db: DBSession) -> int:
    sessions = db.query(SessionModel).filter(
        SessionModel.ended_at.isnot(None)
    ).order_by(SessionModel.started_at.desc()).all()

    if not sessions:
        return 0

    streak = 0
    check_date = datetime.utcnow().date()

    seen_dates = sorted(
        set(s.started_at.date() for s in sessions), reverse=True
    )

    for d in seen_dates:
        if d == check_date or d == check_date - timedelta(days=1):
            streak += 1
            check_date = d - timedelta(days=1)
        else:
            break

    return streak


def get_weekly_seconds(db: DBSession) -> int:
    week_ago = datetime.utcnow() - timedelta(days=7)
    sessions = db.query(SessionModel).filter(
        SessionModel.started_at >= week_ago,
        SessionModel.duration_seconds.isnot(None),
    ).all()
    return sum(s.duration_seconds for s in sessions)


def get_certification_completion(db: DBSession, certification: str, total_questions: int) -> float:
    mastered = db.query(Progress).filter_by(
        certification=certification, mastery_status="mastered"
    ).count()
    if total_questions == 0:
        return 0.0
    return round((mastered / total_questions) * 100, 1)


def get_topic_mastery(db: DBSession, certification: str) -> list:
    rows = db.query(Progress).filter_by(certification=certification).all()
    return [
        {
            "section": r.section,
            "objective": r.objective,
            "mastery_status": r.mastery_status,
            "questions_seen": r.questions_seen,
            "correct_count": r.correct_count,
            "current_difficulty": r.current_difficulty,
        }
        for r in rows
    ]

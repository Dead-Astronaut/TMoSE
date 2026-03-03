import json
import os
from typing import List, Optional, Dict
from pathlib import Path

QUESTIONS_DIR = Path(__file__).parent.parent.parent / "questions"

_cache: Dict[str, list] = {}


def _load_certification(cert: str) -> list:
    if cert in _cache:
        return _cache[cert]
    path = QUESTIONS_DIR / f"{cert.lower()}.json"
    if not path.exists():
        return []
    with open(path) as f:
        questions = json.load(f)
    _cache[cert] = questions
    return questions


def get_next_question(
    certification: str,
    section: Optional[str] = None,
    difficulty: int = 1,
    seen_ids: Optional[List[str]] = None,
) -> Optional[dict]:
    questions = _load_certification(certification)
    seen_ids = seen_ids or []

    candidates = [
        q for q in questions
        if q["id"] not in seen_ids
        and q["difficulty"] == difficulty
        and (section is None or q["section"] == section)
    ]

    # Fallback: any unseen question in this cert
    if not candidates:
        candidates = [q for q in questions if q["id"] not in seen_ids]

    if not candidates:
        return None

    return candidates[0]


def get_question_by_id(question_id: str) -> Optional[dict]:
    for cert in ["pcep", "pcap", "pcpp1", "pcei"]:
        for q in _load_certification(cert):
            if q["id"] == question_id:
                return q
    return None


def get_all_for_cert(certification: str) -> list:
    return _load_certification(certification)

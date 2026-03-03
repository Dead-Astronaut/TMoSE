from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class Certification(str, Enum):
    PCEP = "PCEP"
    PCAP = "PCAP"
    PCPP1 = "PCPP1"
    PCEI = "PCEI"

class QuestionType(str, Enum):
    multiple_choice = "multiple_choice"
    true_false = "true_false"
    code_snippet = "code_snippet"
    spot_the_bug = "spot_the_bug"

class MasteryStatus(str, Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    mastered = "mastered"

class Question(BaseModel):
    id: str
    certification: Certification
    section: str
    objective: str
    type: QuestionType
    question_text: str
    code_snippet: Optional[str] = None
    options: List[str]
    correct_answer: str
    explanation: str
    difficulty: int  # 1-3

class AnswerSubmit(BaseModel):
    question_id: str
    session_id: str
    user_answer: str
    time_taken_seconds: Optional[int] = None

class AnswerResult(BaseModel):
    is_correct: bool
    explanation: str
    correct_answer: str

class SessionCreate(BaseModel):
    certification: Certification

class SessionResponse(BaseModel):
    session_id: str
    started_at: str

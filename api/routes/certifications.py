from fastapi import APIRouter

router = APIRouter()

CERTIFICATIONS = [
    {"id": "PCEP", "name": "Python Certified Entry-Professional", "order": 1, "unlock_threshold": 0.0, "status": "unlocked"},
    {"id": "PCAP", "name": "Python Certified Associate Professional", "order": 2, "unlock_threshold": 0.80, "status": "locked"},
    {"id": "PCPP1", "name": "Python Certified Professional (Level 1)", "order": 3, "unlock_threshold": 0.80, "status": "locked"},
    {"id": "PCEI", "name": "Python Certified Entry-Institutional", "order": 4, "unlock_threshold": 0.80, "status": "locked"},
]

@router.get("")
def get_certifications():
    return CERTIFICATIONS

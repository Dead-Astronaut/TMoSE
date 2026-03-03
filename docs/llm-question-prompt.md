# LLM Question Generation Prompt — my.py

Use this prompt to generate new questions for the my.py question bank.
Validate output against the schema before adding to JSON files.

## Prompt Template

Generate [NUMBER] Python exam questions for the **[CERTIFICATION]** certification,
targeting section **[SECTION]**, objective **[OBJECTIVE]**.

Follow this exact JSON schema:

```json
{
  "id": "[cert-lowercase]-[3-digit-number]",
  "certification": "[PCEP|PCAP|PCPP1|PCEI]",
  "section": "[section number as string]",
  "objective": "[objective number as string]",
  "type": "[multiple_choice|true_false|spot_the_bug|code_snippet]",
  "question_text": "Clear question text",
  "code_snippet": "Python code here, or null",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": "Exact match to one of the options",
  "explanation": "Plain-English explanation.",
  "difficulty": 1
}
```

Rules:
- difficulty: 1=beginner, 2=intermediate, 3=advanced
- correct_answer must be an EXACT string match to one option
- code_snippet must be valid Python 3.11+
- true_false: exactly 2 options ["True", "False"]
- Output only JSON array, no markdown fences

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
import tempfile
from typing import Dict, Any

# Import your modules
from parsers.resume_parser import parse_resume_file, parse_resume_text
from parsers.scorer import calculate_ats_score
from parsers.matcher import analyze_job_match

# -----------------------------
# Initialize FastAPI
# -----------------------------
app = FastAPI(title="AI Resume Assistant API")

# -----------------------------
# Configure CORS for GitHub Pages
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://vivek11004.github.io",  # GitHub Pages frontend
        "http://localhost:3000"          # Optional: local frontend testing
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Health check route
# -----------------------------
@app.get("/")
def health_check():
    return {"status": "ok"}

# -----------------------------
# Request model
# -----------------------------
class JDRequest(BaseModel):
    resume_data: Dict[str, Any]
    job_description: str

# -----------------------------
# Routes
# -----------------------------
@app.post("/parse/file")
async def handle_parse_file(file: UploadFile = File(...)):
    """Parse uploaded resume file."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        data = parse_resume_file(tmp_path)
    finally:
        os.remove(tmp_path)

    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])
    return data


@app.post("/parse/text")
async def handle_parse_text(text: str = Form(...)):
    """Parse resume text from form data."""
    data = parse_resume_text(text)
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])
    return data


@app.post("/score")
async def handle_score_resume(payload: JDRequest):
    """Calculate ATS score for a resume against a job description."""
    result = calculate_ats_score(payload.resume_data, payload.job_description)
    return result


@app.post("/match")
async def handle_match_resume(req: JDRequest):
    """Analyze how well a resume matches a job description."""
    result = analyze_job_match(req.resume_data, req.job_description)
    return result


# -----------------------------
# Run the app with dynamic port
# -----------------------------
if __name__ == "__main__":
    # Ensure NLTK stopwords are downloaded
    try:
        import nltk
        nltk.data.find('corpora/stopwords')
    except (nltk.downloader.DownloadError, LookupError):
        import nltk
        nltk.download('stopwords')

    # Optional: load SpaCy model safely if used
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
    except (ImportError, OSError):
        import spacy
        from spacy.cli import download
        download("en_core_web_sm")
        nlp = spacy.load("en_core_web_sm")

    # Dynamic port for Railway/Render
    PORT = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)

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

app = FastAPI(title="AI Resume Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JDRequest(BaseModel):
    resume_data: Dict[str, Any]
    job_description: str

@app.post("/parse/file")
async def handle_parse_file(file: UploadFile = File(...)):
    # Use a temporary file to save the upload
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name
    
    try:
        data = parse_resume_file(tmp_path)
    finally:
        os.remove(tmp_path) # Clean up the temp file
        
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])
    return data

@app.post("/parse/text")
async def handle_parse_text(text: str = Form(...)):
    data = parse_resume_text(text)
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])
    return data

@app.post("/score")
async def handle_score_resume(payload: JDRequest):
    result = calculate_ats_score(payload.resume_data, payload.job_description)
    return result

@app.post("/match")
async def handle_match_resume(req: JDRequest):
    result = analyze_job_match(req.resume_data, req.job_description)
    return result

if __name__ == "__main__":
    # Install NLTK data if not present
    try:
        import nltk
        nltk.data.find('corpora/stopwords')
    except nltk.downloader.DownloadError:
        import nltk
        nltk.download('stopwords')
        
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
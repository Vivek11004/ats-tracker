import docx
import fitz  # PyMuPDF
import os
from .skills_extractor import extract_skills_from_text
import re

def parse_resume_file(file_path: str) -> dict:
    """Parses a resume file (PDF or DOCX) and extracts information."""
    if not os.path.exists(file_path):
        return {"error": "File not found"}

    text = ""
    if file_path.lower().endswith(".pdf"):
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    elif file_path.lower().endswith(".docx"):
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    else:
        return {"error": "Unsupported file format"}

    return parse_resume_text(text)

def parse_resume_text(text: str) -> dict:
    """Extracts key information from raw resume text."""
    # Simplified extraction using regex
    name = re.search(r'^([A-Z][a-z]+ [A-Z][a-z]+)', text)
    email = re.search(r'[\w\.-]+@[\w\.-]+', text)
    phone = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)

    # Basic section splitting
    experience_text = re.search(r'Experience(.*?)Education', text, re.DOTALL | re.IGNORECASE)
    education_text = re.search(r'Education(.*?)Skills', text, re.DOTALL | re.IGNORECASE)
    
    extracted_skills = extract_skills_from_text(text)

    return {
        "name": name.group(0).strip() if name else "Not Found",
        "email": email.group(0).strip() if email else "Not Found",
        "phone": phone.group(0).strip() if phone else "Not Found",
        "skills": extracted_skills,
        "experience": experience_text.group(1).strip().split('\n') if experience_text else ["Not Found"],
        "education": education_text.group(1).strip().split('\n') if education_text else ["Not Found"],
        "raw_text": text
    }
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .skills_extractor import extract_skills_from_text

def analyze_job_match(resume_data: dict, job_description: str) -> dict:
    """Analyzes the match between a resume and a job description."""
    resume_text = resume_data.get("raw_text", "")
    
    # Keyword Match
    resume_skills = set(s.lower() for s in resume_data.get("skills", []))
    jd_skills = set(s.lower() for s in extract_skills_from_text(job_description))
    
    matched_keywords = list(resume_skills.intersection(jd_skills))
    missing_keywords = list(jd_skills.difference(resume_skills))
    
    # Semantic Similarity (Cosine Similarity)
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    except ValueError:
        similarity = 0.0 # Occurs if one text is empty after stopword removal

    return {
        "similarity_score": round(similarity * 100, 2),
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords
    }
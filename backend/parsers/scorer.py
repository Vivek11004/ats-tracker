import re
from .skills_extractor import extract_skills_from_text

def calculate_ats_score(resume_data: dict, job_description: str = None) -> dict:
    """Calculates an ATS-style score for a resume."""
    score = 0
    feedback = []

    # 1. Section Completeness (Max 30 points)
    required_sections = ['name', 'email', 'phone', 'skills', 'experience', 'education']
    found_sections = sum(1 for section in required_sections if resume_data.get(section) and resume_data[section] != "Not Found")
    section_score = (found_sections / len(required_sections)) * 30
    score += section_score
    if section_score < 30:
        feedback.append(f"Missing sections. Found {found_sections}/{len(required_sections)}.")

    # 2. Keyword Density (Max 40 points)
    resume_skills = resume_data.get('skills', [])
    if job_description:
        jd_skills = extract_skills_from_text(job_description)
        matched_skills = set(s.lower() for s in resume_skills) & set(s.lower() for s in jd_skills)
        if jd_skills:
            keyword_score = (len(matched_skills) / len(jd_skills)) * 40
            score += keyword_score
            feedback.append(f"Matched {len(matched_skills)}/{len(jd_skills)} keywords from the job description.")
        else:
            score += 20 # Default if no JD skills
            feedback.append("No job description provided for keyword comparison.")
    else:
        score += 20 # Default score
        
    # 3. Action Verbs & Quantifiable Metrics (Max 30 points)
    action_verbs = ['developed', 'managed', 'led', 'increased', 'decreased', 'optimized']
    experience_text = ' '.join(resume_data.get('experience', []))
    verb_count = sum(1 for verb in action_verbs if verb in experience_text.lower())
    quant_count = len(re.findall(r'\d+%', experience_text)) # Finds percentages
    
    verb_score = min(verb_count * 3, 15)
    quant_score = min(quant_count * 5, 15)
    score += verb_score + quant_score
    if verb_score < 10:
        feedback.append("Consider adding more action verbs to your experience.")
    if quant_score < 10:
        feedback.append("Try to include more quantifiable achievements (e.g., 'improved by 20%').")

    return {
        "score": int(min(score, 100)),
        "feedback": feedback
    }
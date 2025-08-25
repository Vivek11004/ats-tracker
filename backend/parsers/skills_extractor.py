SKILLS_DB = [
    'python', 'java', 'c++', 'javascript', 'sql', 'react', 'angular', 'vue',
    'node.js', 'aws', 'azure', 'docker', 'kubernetes', 'git', 'scrum', 'agile',
    'machine learning', 'data analysis', 'tensorflow', 'pytorch', 'pandas', 'numpy',
    'communication', 'leadership', 'problem-solving', 'teamwork'
]

def extract_skills_from_text(text: str) -> list:
    """Extracts skills from text based on a predefined list."""
    found_skills = set()
    text_lower = text.lower()
    for skill in SKILLS_DB:
        if skill in text_lower:
            found_skills.add(skill.capitalize())
    return sorted(list(found_skills))
async function exportResume(resumeData, template, format) {
  const res = await fetch('http://127.0.0.1:8000/export', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ resume_data: resumeData, template, format })
  });
  return res.json();
}
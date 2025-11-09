async function exportResume(resumeData, template, format) {
  const res = await fetch('https://caring-balance-production.up.railway.app/export', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ resume_data: resumeData, template, format })
  });
  return res.json();
}

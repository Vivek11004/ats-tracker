document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'ats-tracker-nine.vercel.app';

    // State
    let resumeData = null;

    // DOM Elements
    const uploadBtn = document.getElementById('uploadBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const resumeFile = document.getElementById('resumeFile');
    const resumeText = document.getElementById('resumeText');
    const jobDescription = document.getElementById('jobDescription');
    const loader = document.getElementById('loader');
    const parsedOutput = document.getElementById('parsedOutput');
    const analysisOutput = document.getElementById('analysisOutput');

    // Tab handling
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Event Listeners
    uploadBtn.addEventListener('click', handleParseFile);
    pasteBtn.addEventListener('click', handleParseText);

    async function handleParseFile() {
        if (!resumeFile.files.length) {
            alert('Please select a file first.');
            return;
        }
        const formData = new FormData();
        formData.append('file', resumeFile.files[0]);
        await parseAndAnalyze(formData, `${API_BASE_URL}/parse/file`);
    }

    async function handleParseText() {
        if (!resumeText.value.trim()) {
            alert('Please paste some text first.');
            return;
        }
        const formData = new FormData();
        formData.append('text', resumeText.value);
        await parseAndAnalyze(formData, `${API_BASE_URL}/parse/text`);
    }

    async function parseAndAnalyze(formData, url) {
        setLoading(true);
        parsedOutput.innerHTML = '';
        analysisOutput.innerHTML = '';
        resumeData = null;

        try {
            // 1. Parse the resume
            const parseRes = await fetch(url, { method: 'POST', body: formData });
            if (!parseRes.ok) throw new Error(`Parsing failed: ${await parseRes.text()}`);
            resumeData = await parseRes.json();
            displayParsedData(resumeData);

            // 2. Score and Match
            const jd = jobDescription.value.trim();
            const payload = { resume_data: resumeData, job_description: jd || "" };

            const [scoreRes, matchRes] = await Promise.all([
                fetch(`${API_BASE_URL}/score`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
                fetch(`${API_BASE_URL}/match`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            ]);

            const scoreData = await scoreRes.json();
            const matchData = await matchRes.json();
            displayAnalysis(scoreData, matchData);

        } catch (error) {
            console.error(error);
            parsedOutput.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        } finally {
            setLoading(false);
        }
    }

    function displayParsedData(data) {
        let html = `<h3>${data.name}</h3>`;
        html += `<p><strong>Email:</strong> ${data.email}</p>`;
        html += `<p><strong>Phone:</strong> ${data.phone}</p>`;
        html += `<h4>Skills</h4><ul>${data.skills.map(s => `<li>${s}</li>`).join('')}</ul>`;
        parsedOutput.innerHTML = html;
    }

    function displayAnalysis(scoreData, matchData) {
        let html = `<h3>ATS Score: ${scoreData.score}/100</h3>`;
        html += `<ul>${scoreData.feedback.map(f => `<li>${f}</li>`).join('')}</ul>`;
        
        html += `<hr><h3>Job Match Analysis</h3>`;
        html += `<p><strong>Semantic Similarity:</strong> ${matchData.similarity_score}%</p>`;
        html += `<h4>Matched Keywords:</h4><p>${matchData.matched_keywords.join(', ') || 'None'}</p>`;
        html += `<h4>Missing Keywords:</h4><p>${matchData.missing_keywords.join(', ') || 'None'}</p>`;

        analysisOutput.innerHTML = html;
    }

    function setLoading(isLoading) {
        loader.style.display = isLoading ? 'block' : 'none';
    }
});

"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

document.addEventListener('DOMContentLoaded', function () {
  var API_BASE_URL = 'http://127.0.0.1:8000'; // State

  var resumeData = null; // DOM Elements

  var uploadBtn = document.getElementById('uploadBtn');
  var pasteBtn = document.getElementById('pasteBtn');
  var resumeFile = document.getElementById('resumeFile');
  var resumeText = document.getElementById('resumeText');
  var jobDescription = document.getElementById('jobDescription');
  var loader = document.getElementById('loader');
  var parsedOutput = document.getElementById('parsedOutput');
  var analysisOutput = document.getElementById('analysisOutput'); // Tab handling

  var tabButtons = document.querySelectorAll('.tab-btn');
  var tabContents = document.querySelectorAll('.tab-content');
  tabButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      tabButtons.forEach(function (btn) {
        return btn.classList.remove('active');
      });
      button.classList.add('active');
      tabContents.forEach(function (content) {
        return content.classList.remove('active');
      });
      document.getElementById(button.dataset.tab).classList.add('active');
    });
  }); // Event Listeners

  uploadBtn.addEventListener('click', handleParseFile);
  pasteBtn.addEventListener('click', handleParseText);

  function handleParseFile() {
    var formData;
    return regeneratorRuntime.async(function handleParseFile$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (resumeFile.files.length) {
              _context.next = 3;
              break;
            }

            alert('Please select a file first.');
            return _context.abrupt("return");

          case 3:
            formData = new FormData();
            formData.append('file', resumeFile.files[0]);
            _context.next = 7;
            return regeneratorRuntime.awrap(parseAndAnalyze(formData, "".concat(API_BASE_URL, "/parse/file")));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    });
  }

  function handleParseText() {
    var formData;
    return regeneratorRuntime.async(function handleParseText$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (resumeText.value.trim()) {
              _context2.next = 3;
              break;
            }

            alert('Please paste some text first.');
            return _context2.abrupt("return");

          case 3:
            formData = new FormData();
            formData.append('text', resumeText.value);
            _context2.next = 7;
            return regeneratorRuntime.awrap(parseAndAnalyze(formData, "".concat(API_BASE_URL, "/parse/text")));

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    });
  }

  function parseAndAnalyze(formData, url) {
    var parseRes, jd, payload, _ref, _ref2, scoreRes, matchRes, scoreData, matchData;

    return regeneratorRuntime.async(function parseAndAnalyze$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            setLoading(true);
            parsedOutput.innerHTML = '';
            analysisOutput.innerHTML = '';
            resumeData = null;
            _context3.prev = 4;
            _context3.next = 7;
            return regeneratorRuntime.awrap(fetch(url, {
              method: 'POST',
              body: formData
            }));

          case 7:
            parseRes = _context3.sent;

            if (parseRes.ok) {
              _context3.next = 16;
              break;
            }

            _context3.t0 = Error;
            _context3.t1 = "Parsing failed: ";
            _context3.next = 13;
            return regeneratorRuntime.awrap(parseRes.text());

          case 13:
            _context3.t2 = _context3.sent;
            _context3.t3 = _context3.t1.concat.call(_context3.t1, _context3.t2);
            throw new _context3.t0(_context3.t3);

          case 16:
            _context3.next = 18;
            return regeneratorRuntime.awrap(parseRes.json());

          case 18:
            resumeData = _context3.sent;
            displayParsedData(resumeData); // 2. Score and Match

            jd = jobDescription.value.trim();
            payload = {
              resume_data: resumeData,
              job_description: jd || ""
            };
            _context3.next = 24;
            return regeneratorRuntime.awrap(Promise.all([fetch("".concat(API_BASE_URL, "/score"), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            }), fetch("".concat(API_BASE_URL, "/match"), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            })]));

          case 24:
            _ref = _context3.sent;
            _ref2 = _slicedToArray(_ref, 2);
            scoreRes = _ref2[0];
            matchRes = _ref2[1];
            _context3.next = 30;
            return regeneratorRuntime.awrap(scoreRes.json());

          case 30:
            scoreData = _context3.sent;
            _context3.next = 33;
            return regeneratorRuntime.awrap(matchRes.json());

          case 33:
            matchData = _context3.sent;
            displayAnalysis(scoreData, matchData);
            _context3.next = 41;
            break;

          case 37:
            _context3.prev = 37;
            _context3.t4 = _context3["catch"](4);
            console.error(_context3.t4);
            parsedOutput.innerHTML = "<p style=\"color: red;\">Error: ".concat(_context3.t4.message, "</p>");

          case 41:
            _context3.prev = 41;
            setLoading(false);
            return _context3.finish(41);

          case 44:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[4, 37, 41, 44]]);
  }

  function displayParsedData(data) {
    var html = "<h3>".concat(data.name, "</h3>");
    html += "<p><strong>Email:</strong> ".concat(data.email, "</p>");
    html += "<p><strong>Phone:</strong> ".concat(data.phone, "</p>");
    html += "<h4>Skills</h4><ul>".concat(data.skills.map(function (s) {
      return "<li>".concat(s, "</li>");
    }).join(''), "</ul>");
    parsedOutput.innerHTML = html;
  }

  function displayAnalysis(scoreData, matchData) {
    var html = "<h3>ATS Score: ".concat(scoreData.score, "/100</h3>");
    html += "<ul>".concat(scoreData.feedback.map(function (f) {
      return "<li>".concat(f, "</li>");
    }).join(''), "</ul>");
    html += "<hr><h3>Job Match Analysis</h3>";
    html += "<p><strong>Semantic Similarity:</strong> ".concat(matchData.similarity_score, "%</p>");
    html += "<h4>Matched Keywords:</h4><p>".concat(matchData.matched_keywords.join(', ') || 'None', "</p>");
    html += "<h4>Missing Keywords:</h4><p>".concat(matchData.missing_keywords.join(', ') || 'None', "</p>");
    analysisOutput.innerHTML = html;
  }

  function setLoading(isLoading) {
    loader.style.display = isLoading ? 'block' : 'none';
  }
});
//# sourceMappingURL=app.dev.js.map

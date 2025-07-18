
let currentMode = 'grammar';
let analysisTimeout;

// Mode selection
function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Re-analyze with new mode if text exists
    const text = document.getElementById('textInput').value;
    if (text.trim()) {
        analyzeText();
    }
}

// Main analysis function
function analyzeText() {
    const text = document.getElementById('textInput').value;
    const analysisResults = document.getElementById('analysisResults');
    const suggestionsList = document.getElementById('suggestionsList');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Update stats immediately
    updateStats(text);

    if (text.trim() === '') {
        analysisResults.innerHTML = 'Type or paste text in the left panel to see AI-powered writing suggestions appear here.';
        suggestionsList.innerHTML = '';
        return;
    }

    // Show loading
    loadingIndicator.classList.remove('hidden');
    analysisResults.innerHTML = '';

    // Clear previous timeout
    clearTimeout(analysisTimeout);

    // Simulate AI analysis with delay
    analysisTimeout = setTimeout(() => {
        loadingIndicator.classList.add('hidden');

        const analysis = performAnalysis(text, currentMode);
        displayAnalysis(analysis);
        displaySuggestions(analysis.suggestions);
    }, 1500);
}

// Simulated AI analysis
function performAnalysis(text, mode) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    let analysis = {
        mode: mode,
        originalText: text,
        issues: [],
        suggestions: [],
        score: 0
    };

    switch (mode) {
        case 'grammar':
            analysis = analyzeGrammar(text, words, sentences);
            break;
        case 'style':
            analysis = analyzeStyle(text, words, sentences);
            break;
        case 'clarity':
            analysis = analyzeClarity(text, words, sentences);
            break;
        case 'creative':
            analysis = analyzeCreative(text, words, sentences);
            break;
    }

    return analysis;
}

function analyzeGrammar(text, words, sentences) {
    let issues = [];
    let suggestions = [];

    // Check for common grammar issues
    if (text.includes(' there ') && text.includes(' their ')) {
        issues.push('Possible there/their confusion');
        suggestions.push({
            title: 'Grammar: There vs Their',
            text: 'Check usage of "there" (location) vs "their" (possession)',
            type: 'grammar'
        });
    }

    if (text.match(/\b(its|it's)\b/gi)) {
        suggestions.push({
            title: 'Grammar: Its vs It\'s',
            text: 'Remember: "its" = possession, "it\'s" = it is',
            type: 'grammar'
        });
    }

    if (sentences.some(s => s.split(' ').length > 25)) {
        issues.push('Long sentences detected');
        suggestions.push({
            title: 'Sentence Length',
            text: 'Consider breaking up sentences longer than 25 words for better readability',
            type: 'structure'
        });
    }

    // Check for missing punctuation
    if (text.match(/[a-z]\s+[A-Z]/)) {
        issues.push('Possible missing punctuation');
        suggestions.push({
            title: 'Punctuation Check',
            text: 'Some sentences may be missing end punctuation',
            type: 'grammar'
        });
    }

    return {
        mode: 'grammar',
        issues: issues,
        suggestions: suggestions,
        score: Math.max(100 - (issues.length * 15), 20)
    };
}

function analyzeStyle(text, words, sentences) {
    let issues = [];
    let suggestions = [];

    // Check for passive voice
    if (text.match(/\b(was|were|is|are|been)\s+\w*ed\b/gi)) {
        issues.push('Passive voice detected');
        suggestions.push({
            title: 'Active Voice',
            text: 'Consider using active voice for more engaging writing',
            type: 'style'
        });
    }

    // Check for repetitive words
    const wordFreq = {};
    words.forEach(word => {
        const lower = word.toLowerCase().replace(/[^a-z]/g, '');
        if (lower.length > 3) {
            wordFreq[lower] = (wordFreq[lower] || 0) + 1;
        }
    });

    for (let word in wordFreq) {
        if (wordFreq[word] > 3) {
            issues.push(`Word "${word}" used ${wordFreq[word]} times`);
            suggestions.push({
                title: 'Word Variety',
                text: `Consider synonyms for "${word}" to add variety`,
                type: 'style'
            });
        }
    }

    // Check sentence variety
    const avgSentenceLength = words.length / sentences.length;
    if (avgSentenceLength < 8) {
        suggestions.push({
            title: 'Sentence Variety',
            text: 'Try combining some short sentences for better flow',
            type: 'style'
        });
    }

    return {
        mode: 'style',
        issues: issues,
        suggestions: suggestions,
        score: Math.max(100 - (issues.length * 10), 30)
    };
}

function analyzeClarity(text, words, sentences) {
    let issues = [];
    let suggestions = [];

    // Check for complex words
    const complexWords = words.filter(word => word.length > 12);
    if (complexWords.length > words.length * 0.1) {
        issues.push('Many complex words detected');
        suggestions.push({
            title: 'Word Complexity',
            text: 'Consider simpler alternatives for complex words to improve readability',
            type: 'clarity'
        });
    }

    // Check for unclear pronouns
    if (text.match(/\b(this|that|it|they)\s/gi)) {
        suggestions.push({
            title: 'Pronoun Clarity',
            text: 'Ensure pronouns clearly refer to specific nouns',
            type: 'clarity'
        });
    }

    // Check paragraph structure
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    if (paragraphs.length === 1 && words.length > 100) {
        suggestions.push({
            title: 'Paragraph Structure',
            text: 'Consider breaking long text into multiple paragraphs',
            type: 'structure'
        });
    }

    return {
        mode: 'clarity',
        issues: issues,
        suggestions: suggestions,
        score: Math.max(100 - (issues.length * 12), 25)
    };
}

function analyzeCreative(text, words, sentences) {
    let issues = [];
    let suggestions = [];

    // Check for descriptive language
    const descriptiveWords = words.filter(word =>
        /\b(beautiful|amazing|wonderful|terrible|huge|tiny|bright|dark)\b/i.test(word)
    );

    if (descriptiveWords.length < words.length * 0.05) {
        suggestions.push({
            title: 'Descriptive Language',
            text: 'Add more vivid adjectives and adverbs to enhance imagery',
            type: 'creative'
        });
    }

    // Check for dialogue
    if (!text.includes('"') && text.length > 200) {
        suggestions.push({
            title: 'Character Dialogue',
            text: 'Consider adding dialogue to bring characters to life',
            type: 'creative'
        });
    }

    // Check for sensory details
    const sensoryWords = words.filter(word =>
        /\b(see|hear|feel|smell|taste|touch|sound|look|bright|loud|soft|sweet|rough)\b/i.test(word)
    );

    if (sensoryWords.length < words.length * 0.03) {
        suggestions.push({
            title: 'Sensory Details',
            text: 'Include more sensory details to help readers experience the scene',
            type: 'creative'
        });
    }

    return {
        mode: 'creative',
        issues: issues,
        suggestions: suggestions,
        score: Math.max(85 - (issues.length * 8), 40)
    };
}

function displayAnalysis(analysis) {
    const analysisResults = document.getElementById('analysisResults');
    const issuesFound = document.getElementById('issuesFound');
    const readabilityScore = document.getElementById('readabilityScore');

    issuesFound.textContent = analysis.issues.length;
    readabilityScore.textContent = analysis.score;

    let html = `<h4>📊 Analysis Results (${analysis.mode.charAt(0).toUpperCase() + analysis.mode.slice(1)} Mode)</h4>`;

    if (analysis.issues.length === 0) {
        html += `
                    <div style="color: #28a745; margin: 15px 0;">
                        ✅ <strong>Great work!</strong> No major issues found in your text.
                    </div>
                `;
    } else {
        html += `<div style="margin: 15px 0;"><strong>Issues detected:</strong></div><ul style="margin-left: 20px;">`;
        analysis.issues.forEach(issue => {
            html += `<li style="margin: 5px 0; color: #dc3545;">${issue}</li>`;
        });
        html += `</ul>`;
    }

    html += `
                <div style="margin-top: 20px;">
                    <strong>Overall Score:</strong> 
                    <span style="color: ${analysis.score > 70 ? '#28a745' : analysis.score > 50 ? '#ffc107' : '#dc3545'}; font-size: 18px; font-weight: bold;">
                        ${analysis.score}/100
                    </span>
                </div>
            `;

    analysisResults.innerHTML = html;
}

function displaySuggestions(suggestions) {
    const suggestionsList = document.getElementById('suggestionsList');

    if (suggestions.length === 0) {
        suggestionsList.innerHTML = '';
        return;
    }

    let html = '<h4 style="margin-bottom: 15px;">💡 Improvement Suggestions</h4>';

    suggestions.forEach((suggestion, index) => {
        const typeColor = {
            'grammar': '#dc3545',
            'style': '#667eea',
            'clarity': '#28a745',
            'creative': '#ffc107',
            'structure': '#6f42c1'
        };

        html += `
                    <div class="suggestion-item">
                        <div class="suggestion-title" style="color: ${typeColor[suggestion.type] || '#333'};">
                            ${suggestion.title}
                        </div>
                        <div class="suggestion-text">
                            ${suggestion.text}
                        </div>
                    </div>
                `;
    });

    suggestionsList.innerHTML = html;
}

function updateStats(text) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    document.getElementById('wordCount').textContent = words.length;
    document.getElementById('charCount').textContent = text.length;
    document.getElementById('sentenceCount').textContent = sentences.length;
}

// Utility functions
function clearText() {
    document.getElementById('textInput').value = '';
    document.getElementById('analysisResults').innerHTML = 'Type or paste text in the left panel to see AI-powered writing suggestions appear here.';
    document.getElementById('suggestionsList').innerHTML = '';
    updateStats('');
    document.getElementById('issuesFound').textContent = '0';
    document.getElementById('readabilityScore').textContent = '-';
}

function loadExample() {
    const examples = [
        "The students was very excited about there upcoming field trip. Its going to be a amazing experience for all of them.",
        "I am writing to inform you that the meeting has been scheduled. The meeting will be held in the conference room. Please attend the meeting on time.",
        "The magnificent castle stood majestically on the hill, its ancient stones whispering stories of brave knights and beautiful princesses who once walked its grand halls."
    ];

    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    document.getElementById('textInput').value = randomExample;
    analyzeText();
}

function loadExampleText(type) {
    const examples = {
        essay: "The climate change is a serious issue that effects everyone. There are many factors that contribute to this problem. First, the burning of fossil fuels release greenhouse gases. Second, deforestation reduce the number of trees that can absorb carbon dioxide. This problems need immediate attention.",

        email: "Hi there, I hope your doing well. I wanted to reach out about the project we discussed. There might be some issues with the timeline but we can probably work around them. Let me know what you think. Thanks!",

        creative: "The old house was scary. It was dark inside. There were strange noises. The door creaked when it opened. Something was moving in the shadows. The character felt afraid.",

        report: "The research study examined the effectiveness of different teaching methods. The results showed that interactive learning approaches were more effective than traditional lecture-based methods. This finding suggests that educators should consider implementing more interactive techniques in their classrooms."
    };

    document.getElementById('textInput').value = examples[type] || examples.essay;
    analyzeText();
}

function exportText() {
    const text = document.getElementById('textInput').value;
    if (text.trim() === '') {
        alert('No text to export!');
        return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'writing-assistant-text.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    console.log('Writing Assistant loaded successfully!');

    // Load a sample text to demonstrate
    setTimeout(() => {
        loadExample();
    }, 1000);
});

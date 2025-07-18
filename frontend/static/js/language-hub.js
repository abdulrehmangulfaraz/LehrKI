

let currentLanguage = 'spanish';
let currentVocabIndex = 0;
let currentGrammarIndex = 0;
let conversationState = 0;
let cardFlipped = false;

// Language data
const languageData = {
    spanish: {
        vocab: [
            { word: 'Casa', translation: 'House', example: 'Mi casa es muy grande - My house is very big' },
            { word: 'Perro', translation: 'Dog', example: 'El perro corre en el parque - The dog runs in the park' },
            { word: 'Agua', translation: 'Water', example: 'Necesito beber agua - I need to drink water' },
            { word: 'Libro', translation: 'Book', example: 'Leo un libro interesante - I read an interesting book' },
            { word: 'Tiempo', translation: 'Time/Weather', example: 'No tengo tiempo - I don\'t have time' }
        ],
        grammar: [
            { question: 'Complete: "Yo _____ estudiante."', options: ['estoy', 'soy', 'es', 'está'], correct: 1 },
            { question: 'Complete: "Ella _____ en el parque."', options: ['es', 'está', 'son', 'están'], correct: 1 },
            { question: 'Complete: "Nosotros _____ amigos."', options: ['somos', 'estamos', 'son', 'están'], correct: 0 }
        ],
        pronunciation: [
            { word: 'Rojo', guide: '/ˈro.xo/' },
            { word: 'Carro', guide: '/ˈka.ro/' },
            { word: 'Perro', guide: '/ˈpe.ro/' }
        ]
    }
};

// Grammar functions
function selectGrammarOption(element, isCorrect) {
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        opt.onclick = null;
    });

    element.classList.add('selected');

    const feedback = document.getElementById('grammarFeedback');

    if (isCorrect) {
        element.classList.add('correct');
        feedback.className = 'feedback correct';
        feedback.textContent = '¡Correcto! "Soy" is used for permanent characteristics.';
    } else {
        element.classList.add('incorrect');
        // Show correct answer
        const correctOption = document.querySelector('.option:nth-child(2)');
        correctOption.classList.add('correct');
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Incorrect. "Soy" is used for permanent states like being a student.';
    }

    feedback.classList.remove('hidden');
}

function nextGrammarQuestion() {
    currentGrammarIndex = (currentGrammarIndex + 1) % languageData[currentLanguage].grammar.length;
    const questionData = languageData[currentLanguage].grammar[currentGrammarIndex];

    document.getElementById('grammarQuestion').textContent = questionData.question;
    document.getElementById('grammarFeedback').classList.add('hidden');

    const options = document.querySelectorAll('.option');
    options.forEach((opt, index) => {
        opt.textContent = questionData.options[index];
        opt.className = 'option';
        opt.onclick = () => selectGrammarOption(opt, index === questionData.correct);
    });
}

function resetGrammar() {
    currentGrammarIndex = 0;
    nextGrammarQuestion();
}

// Vocabulary functions
function flipVocabCard() {
    cardFlipped = !cardFlipped;
    const translation = document.getElementById('vocabTranslation');
    const example = document.getElementById('vocabExample');
    const button = event.target;

    if (cardFlipped) {
        translation.classList.remove('hidden');
        example.classList.remove('hidden');
        button.textContent = 'Hide Translation';
    } else {
        translation.classList.add('hidden');
        example.classList.add('hidden');
        button.textContent = 'Show Translation';
    }
}

function nextVocabWord(known) {
    currentVocabIndex = (currentVocabIndex + 1) % languageData[currentLanguage].vocab.length;
    const vocabData = languageData[currentLanguage].vocab[currentVocabIndex];

    document.getElementById('vocabWord').textContent = vocabData.word;
    document.getElementById('vocabTranslation').textContent = vocabData.translation;
    document.getElementById('vocabExample').textContent = vocabData.example;

    // Reset card state
    document.getElementById('vocabTranslation').classList.add('hidden');
    document.getElementById('vocabExample').classList.add('hidden');
    cardFlipped = false;

    const button = document.querySelector('.btn-primary');
    button.textContent = 'Show Translation';

    // Update stats based on whether user knew the word
    if (known) {
        updateStats('correct');
    } else {
        updateStats('incorrect');
    }
}

// Conversation functions
function sendConversationMessage() {
    const input = document.getElementById('conversationInput');
    const message = input.value.trim();

    if (message) {
        addConversationMessage(message, 'user');
        input.value = '';

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                '¡Muy bien! ¿Qué le gustaría ordenar? (Very good! What would you like to order?)',
                'Excelente. ¿Prefiere algo para beber? (Excellent. Would you prefer something to drink?)',
                'Perfecto. ¿Algo más? (Perfect. Anything else?)'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addConversationMessage(randomResponse, 'ai');
        }, 1000);
    }
}

function addConversationMessage(message, sender) {
    const conversationArea = document.getElementById('conversationArea');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.textContent = message;
    conversationArea.appendChild(messageElement);
    conversationArea.scrollTop = conversationArea.scrollHeight;
}

function handleConversationEnter(event) {
    if (event.key === 'Enter') {
        sendConversationMessage();
    }
}

function getConversationHint() {
    const hints = [
        'Try: "Estoy bien, gracias" (I\'m fine, thank you)',
        'Try: "Me gustaría..." (I would like...)',
        'Try: "¿Cuánto cuesta?" (How much does it cost?)'
    ];
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    addConversationMessage('💡 Hint: ' + randomHint, 'ai');
}

function newConversationTopic() {
    const topics = [
        'At the grocery store',
        'Asking for directions',
        'Making a doctor\'s appointment',
        'At the hotel reception'
    ];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    document.getElementById('conversationArea').innerHTML = `
                <div class="message ai">
                    New scenario: ${randomTopic}. Let's start! ¡Hola!
                </div>
            `;
}

// Pronunciation functions
function playPronunciation() {
    // Simulate audio playback
    const feedback = document.getElementById('pronunciationFeedback');
    feedback.className = 'feedback correct';
    feedback.textContent = '🔊 Playing pronunciation...';
    feedback.classList.remove('hidden');

    setTimeout(() => {
        feedback.classList.add('hidden');
    }, 2000);
}

function recordPronunciation() {
    const feedback = document.getElementById('pronunciationFeedback');
    feedback.className = 'feedback correct';
    feedback.textContent = '🎤 Recording... Great job! Your pronunciation is 85% accurate.';
    feedback.classList.remove('hidden');
}

function nextPronunciationWord() {
    const pronunciationData = languageData[currentLanguage].pronunciation;
    const currentIndex = pronunciationData.findIndex(p =>
        p.word === document.getElementById('pronunciationWord').textContent
    );
    const nextIndex = (currentIndex + 1) % pronunciationData.length;

    document.getElementById('pronunciationWord').textContent = pronunciationData[nextIndex].word;
    document.getElementById('pronunciationGuide').textContent = pronunciationData[nextIndex].guide;
    document.getElementById('pronunciationFeedback').classList.add('hidden');
}

// Reading functions
function selectReadingOption(element, isCorrect) {
    const options = document.querySelectorAll('#reading-tool .option');
    options.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        opt.onclick = null;
    });

    element.classList.add('selected');

    const feedback = document.getElementById('readingFeedback');

    if (isCorrect) {
        element.classList.add('correct');
        feedback.className = 'feedback correct';
        feedback.textContent = '¡Correcto! The García family lives in Madrid.';
    } else {
        element.classList.add('incorrect');
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Incorrect. Read the first sentence again: "La familia García vive en una casa pequeña en Madrid."';
    }

    feedback.classList.remove('hidden');
}

function nextReadingQuestion() {
    const questions = [
        '¿Cuál es el trabajo de Carlos?',
        '¿Cuántos años tiene Ana?',
        '¿Qué hace la familia los fines de semana?'
    ];
    // This would cycle through different questions in a full implementation
    alert('Next reading question would appear here in the full version!');
}

function newReadingText() {
    alert('A new reading passage would load here in the full version!');
}

// Writing functions
function analyzeWriting() {
    const text = document.getElementById('writingText').value;
    const feedback = document.getElementById('writingFeedback');

    if (text.trim() === '') {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Please write something first!';
        feedback.classList.remove('hidden');
        return;
    }

    feedback.className = 'feedback correct';
    feedback.textContent = '✅ Good use of vocabulary! Consider adding more descriptive adjectives. Your verb tenses are mostly correct.';
    feedback.classList.remove('hidden');
}

function newWritingPrompt() {
    const prompts = [
        'Describe your daily routine in Spanish.',
        'Write about your favorite food and why you like it.',
        'Explain what you did last weekend.',
        'Describe your best friend or family member.'
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    document.querySelector('.writing-prompt').innerHTML = `
                <strong>Writing Prompt:</strong> ${randomPrompt} (100-150 words)
            `;
    document.getElementById('writingText').value = '';
    document.getElementById('writingFeedback').classList.add('hidden');
}

function saveWriting() {
    alert('Your writing has been saved to your progress!');
}

// Utility functions
function setLanguage(language) {
    currentLanguage = language;

    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Reset tools with new language data
    currentVocabIndex = 0;
    currentGrammarIndex = 0;

    // Update vocab card
    const vocabData = languageData[currentLanguage].vocab[0];
    document.getElementById('vocabWord').textContent = vocabData.word;
    document.getElementById('vocabTranslation').textContent = vocabData.translation;
    document.getElementById('vocabExample').textContent = vocabData.example;

    // Reset grammar
    resetGrammar();

    alert(`Switched to ${language.charAt(0).toUpperCase() + language.slice(1)} learning mode!`);
}

function updateStats(result) {
    if (result === 'correct') {
        const accuracy = document.getElementById('accuracy');
        const current = parseInt(accuracy.textContent);
        accuracy.textContent = Math.min(current + 1, 100) + '%';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    console.log('Language Learning Hub loaded successfully!');

    // Set initial vocab word
    const vocabData = languageData[currentLanguage].vocab[0];
    document.getElementById('vocabWord').textContent = vocabData.word;
    document.getElementById('vocabTranslation').textContent = vocabData.translation;
    document.getElementById('vocabExample').textContent = vocabData.example;
});

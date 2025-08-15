
// Sample data for demo
const flashcards = [
    { front: 'perro', back: 'dog' },
    { front: 'gato', back: 'cat' },
    { front: 'casa', back: 'house' }
];
let currentCard = 0;

// Navigation
function showSection(section) {
    document.querySelectorAll('.section-content').forEach(el => {
        el.style.display = 'none';
    });
    document.getElementById(section + '-section').style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Practice starters
function startPractice(type, list) {
    alert(`Starting ${type} for ${list}`);
    // In real app, this would load the practice mode
}

// Flashcard demo
function showFlashcardDemo() {
    document.getElementById('flashcard-demo').style.display = 'block';
    document.getElementById('quiz-demo').style.display = 'none';
    document.getElementById('conversation-demo').style.display = 'none';
    document.getElementById('writing-demo').style.display = 'none';
    updateCard();
}

function flipCard() {
    document.getElementById('flashcard').classList.toggle('flipped');
}

function nextCard() {
    currentCard = (currentCard + 1) % flashcards.length;
    updateCard();
    document.getElementById('flashcard').classList.remove('flipped');
}

function updateCard() {
    document.querySelector('.flashcard-front').textContent = flashcards[currentCard].front;
    document.querySelector('.flashcard-back').textContent = flashcards[currentCard].back;
}

// Quiz demo
function showQuizDemo() {
    document.getElementById('quiz-demo').style.display = 'block';
    document.getElementById('flashcard-demo').style.display = 'none';
    document.getElementById('conversation-demo').style.display = 'none';
    document.getElementById('writing-demo').style.display = 'none';
    resetQuizOptions();
}

function checkAnswer(option, isCorrect) {
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.style.pointerEvents = 'none';
        if (opt === option) {
            opt.classList.add(isCorrect ? 'correct' : 'incorrect');
        } else if (opt.innerText === 'to be') {
            opt.classList.add('correct');
        }
    });
}

function resetQuizOptions() {
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
        opt.style.pointerEvents = 'auto';
    });
}

// Conversation demo
function showConversationDemo() {
    document.getElementById('conversation-demo').style.display = 'block';
    document.getElementById('flashcard-demo').style.display = 'none';
    document.getElementById('quiz-demo').style.display = 'none';
    document.getElementById('writing-demo').style.display = 'none';
}

// Writing demo
function showWritingDemo() {
    document.getElementById('writing-demo').style.display = 'block';
    document.getElementById('flashcard-demo').style.display = 'none';
    document.getElementById('quiz-demo').style.display = 'none';
    document.getElementById('conversation-demo').style.display = 'none';
}

// Global state
let currentSection = 'home';
let isLoggedIn = false;
let chatOpen = false;

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show selected section
    document.getElementById(sectionId).classList.remove('hidden');

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');

    currentSection = sectionId;
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Role switching function
function switchRole(role) {
    // Update active role tab
    document.querySelectorAll('.role-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-role="${role}"]`).classList.add('active');

    // Hide all navigation sections
    document.querySelectorAll('.nav-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected role navigation
    document.querySelector(`.${role}-nav`).classList.add('active');

    // Always show common navigation
    document.querySelector('.common-nav').classList.add('active');

    console.log(`Switched to ${role} role`);
}

function toggleCategory(categoryElement) {
    // Toggle expanded class on category
    categoryElement.classList.toggle('expanded');

    // Get the next sibling (nav-subcategories)
    const subcategories = categoryElement.nextElementSibling;
    if (subcategories && subcategories.classList.contains('nav-subcategories')) {
        subcategories.classList.toggle('expanded');
    }

    // Close other open categories (optional - uncomment if you want accordion behavior)
    /*
    const allCategories = document.querySelectorAll('.nav-category');
    const allSubcategories = document.querySelectorAll('.nav-subcategories');
    
    allCategories.forEach(cat => {
        if (cat !== categoryElement) {
            cat.classList.remove('expanded');
        }
    });
    
    allSubcategories.forEach(sub => {
        if (sub !== subcategories) {
            sub.classList.remove('expanded');
        }
    });
    */
}

function showBeginnerPath() {
    alert('Welcome! LehrKI will guide you through your AI journey. This would start a guided tour in the full version.');
    showSection('teacher-tools');
}

function showAdvancedPath() {
    showSection('teacher-tools');
}

function navigateToPromptCollection() {
    window.location.href = 'prompt-collection.html';
}

// Modal functions
function showModal(modalType) {
    const modal = document.getElementById(modalType + 'Modal');
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

function hideModal(modalType) {
    const modal = document.getElementById(modalType + 'Modal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
    document.getElementById(modalType + 'Alert').classList.add('hidden');
}

function showTipsModal() {
    showModal('tips');
}

function hideTipsModal() {
    hideModal('tips');
}

// Login functionality
const loginForm = document.getElementById('loginForm');
const loginAlert = document.getElementById('loginAlert');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        loginAlert.classList.add('hidden');

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString(),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('accessToken', result.access_token);

                if (result.user_role === 'admin') {
                    window.location.href = '/admin-dashboard.html';
                } else {
                    window.location.href = '/dashboard.html';
                }
            } else {
                loginAlert.textContent = `Error: ${result.detail}`;
                loginAlert.classList.remove('hidden');
            }
        } catch (error) {
            loginAlert.textContent = 'An unexpected network error occurred.';
            loginAlert.classList.remove('hidden');
        }
    });
}
// Register functionality
const registerForm = document.getElementById('registerForm');
const registerAlert = document.getElementById('registerAlert');

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        registerAlert.classList.add('hidden');

        const fullName = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (password !== confirmPassword) {
            registerAlert.textContent = 'Passwords do not match.';
            registerAlert.classList.remove('hidden');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: fullName, email: email, password: password }),
            });

            const result = await response.json();

            if (response.ok) {
                hideModal('register');
                alert('Registration successful! Please log in.');
                showModal('login');
            } else {
                registerAlert.textContent = `Error: ${result.detail}`;
                registerAlert.classList.remove('hidden');
            }
        } catch (error) {
            registerAlert.textContent = 'An unexpected network error occurred.';
            registerAlert.classList.remove('hidden');
        }
    });
}

// Chat functionality
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatOpen = !chatOpen;
    chatWindow.classList.toggle('hidden');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (message) {
        const messagesContainer = document.getElementById('chatMessages');

        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.textContent = message;
        messagesContainer.appendChild(userMessage);

        // Add AI response (simulated)
        setTimeout(() => {
            const aiMessage = document.createElement('div');
            aiMessage.className = 'message ai';
            aiMessage.textContent = getAIResponse(message);
            messagesContainer.appendChild(aiMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);

        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function getAIResponse(message) {
    const responses = [
        "That's a great question! AI can definitely help with that aspect of teaching.",
        "I'd recommend starting with our Quiz Creator tool for that type of activity.",
        "Have you tried our Parent Letter Writer? It might be perfect for your needs.",
        "For lesson planning, our Sports Lesson Planner could be very useful.",
        "That sounds like a perfect use case for our Story Generator tool!",
        "I can help you explore different AI tools for your specific teaching needs."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

// Tool launch function
function launchTool(toolName) {
    if (toolName === 'writing-assistant') {
        // Navigate to writing assistant hub
        window.location.href = 'writing-assistant.html';
    } else if (toolName === 'language-hub') {
        // Navigate to language learning hub
        window.location.href = 'language-hub.html';
    } else if (toolName === 'quiz-creator') {
        // Navigate to quiz creator
        showSection('quiz-creator');
    } else if (toolName === 'lesson-planner') {
        // Navigate to lesson planner
        showSection('lesson-planner');
    } else if (toolName === 'ai-tools-directory') {
        // Navigate to AI tools directory
        window.location.href = 'ai-tools-directory.html';
    } else {
        alert(`Launching ${toolName} tool... In the full version, this would open the actual AI tool interface.`);
    }
}

// Filter functionality
function filterTools(category) {
    const tools = document.querySelectorAll('.tool-card');
    const filterTags = document.querySelectorAll('.filter-tag');

    // Update active filter
    filterTags.forEach(tag => tag.classList.remove('active'));
    event.target.classList.add('active');

    // Show/hide tools
    tools.forEach(tool => {
        if (category === 'all' || tool.dataset.category === category) {
            tool.style.display = 'block';
        } else {
            tool.style.display = 'none';
        }
    });
}

// Lesson Planner Functions
function useLessonTemplate(templateType) {
    alert(`Loading ${templateType} template... In the full version, this would open a detailed lesson plan template.`);
}

// Assessment Center Functions
function showAssessmentSection(sectionName) {
    document.querySelectorAll('.assessment-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    const targetSection = document.getElementById(`assessment-${sectionName}`);
    if (targetSection) targetSection.classList.add('active');

    if (event && event.target) event.target.classList.add('active');
}

function launchAssessmentTool(toolName) {
    alert(`Launching ${toolName}... In the full version, this would open the actual assessment tool.`);
}

function useAssessmentTemplate(templateName) {
    alert(`Loading ${templateName} template...`);
}

function generateAIRubric() {
    alert('AI Rubric Generator activated!');
}

function exportRubric() {
    alert('Rubric exported!');
}

function addCustomCriteria() {
    alert('Custom criteria builder opened!');
}

function generateAIFeedback() {
    alert('AI Feedback Generator activated!');
}

function copyFeedback() {
    alert('Feedback copied to clipboard!');
}

function generateFullReport() {
    alert('Generating full analytics report...');
}

function exportAnalytics() {
    alert('Analytics data exported!');
}

function addNewAssignment() {
    alert('New assignment creator opened!');
}

function calculateGrades() {
    alert('Grades calculated!');
}

function exportGradebook() {
    alert('Gradebook exported!');
}

// Enable Enter key for chat
document.getElementById('chatInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.add('hidden');
            this.classList.remove('show');
        }
    });
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    console.log('AI Teacher Toolkit loaded successfully!');

    // Initialize role navigation - start with teacher role
    switchRole('teacher');
});


// Alle alten Buttons entfernen
document.addEventListener('DOMContentLoaded', function () {
    // Warte kurz, dann erstelle Button aggressiv
    setTimeout(function () {
        // Entferne alle existierenden Buttons
        const oldButtons = document.querySelectorAll('[onclick*="toggleChatInterface"]');
        oldButtons.forEach(btn => btn.remove());

        // NEUER ROBOTER BUTTON - AGGRESSIV EINGEFÜGT
        const robotButton = document.createElement('div');
        robotButton.id = 'ROBOT_BUTTON_FINAL';
        robotButton.innerHTML = '🤖';
        robotButton.onclick = function () { toggleChatInterface(); };

        // AGGRESSIVE STYLES - ÜBERSCHREIBT ALLES
        robotButton.style.cssText = `
                            position: fixed !important;
                            bottom: 20px !important;
                            right: 20px !important;
                            width: 60px !important;
                            height: 60px !important;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                            border-radius: 50% !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            font-size: 28px !important;
                            color: white !important;
                            cursor: pointer !important;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
                            z-index: 999999 !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                            border: none !important;
                            outline: none !important;
                            transform: scale(1) !important;
                            transition: all 0.3s ease !important;
                        `;

        // SOFORT IN BODY EINFÜGEN
        document.body.appendChild(robotButton);

        // HOVER EFFEKT
        robotButton.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1) !important';
        });
        robotButton.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) !important';
        });

        // BESTÄTIGUNG IM CONSOLE
        console.log('🤖 ROBOTER BUTTON ERFOLGREICH ERSTELLT!');

        // NOTFALL-ALERT NACH 3 SEKUNDEN FALLS IMMER NOCH NICHT SICHTBAR
        setTimeout(function () {
            if (!document.getElementById('ROBOT_BUTTON_FINAL')) {
                alert('🤖 ROBOTER BUTTON WURDE ERSTELLT! Schauen Sie unten rechts!');
            }
        }, 3000);

    }, 500);
});

// CHATBOT INTERFACE (falls nicht existiert)
function toggleChatInterface() {
    let chat = document.getElementById('chatInterface');
    if (!chat) {
        // ERSTELLE CHAT INTERFACE FALLS NICHT EXISTIERT
        chat = document.createElement('div');
        chat.id = 'chatInterface';
        chat.style.cssText = `
                            position: fixed !important;
                            bottom: 90px !important;
                            right: 20px !important;
                            width: 350px !important;
                            height: 500px !important;
                            background: white !important;
                            border-radius: 15px !important;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
                            z-index: 999998 !important;
                            display: flex !important;
                            flex-direction: column !important;
                            overflow: hidden !important;
                        `;

        chat.innerHTML = `
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                                color: white !important; padding: 15px !important; font-weight: bold !important;
                                display: flex !important; justify-content: space-between !important; align-items: center !important;">
                                <span>🤖 AI Assistant</span>
                                <button onclick="toggleChatInterface()" style="background: none !important; border: none !important;
                                        color: white !important; font-size: 20px !important; cursor: pointer !important;">&times;</button>
                            </div>
                            <div id="chatMessages" style="flex: 1 !important; padding: 15px !important; overflow-y: auto !important;
                                                          background: #f8f9fa !important;">
                                <div style="background: #e9ecef !important; padding: 10px !important; border-radius: 10px !important; margin-bottom: 10px !important;">
                                    👋 Hallo! Ich bin Ihr AI Teaching Assistant. Wie kann ich Ihnen heute helfen?
                                </div>
                            </div>
                            <div style="padding: 15px !important; border-top: 1px solid #eee !important; background: white !important;">
                                <div style="display: flex !important; gap: 10px !important;">
                                    <input type="text" id="chatInput" placeholder="Ihre Nachricht..."
                                           style="flex: 1 !important; padding: 10px !important; border: 1px solid #ddd !important; 
                                                  border-radius: 20px !important; outline: none !important;">
                                    <button onclick="sendChatMessage()"
                                            style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                                                   color: white !important; border: none !important; padding: 10px 15px !important; 
                                                   border-radius: 20px !important; cursor: pointer !important;">
                                        📤
                                    </button>
                                </div>
                            </div>
                        `;
        document.body.appendChild(chat);
    }

    // TOGGLE SICHTBARKEIT
    if (chat.style.display === 'none' || chat.style.display === '') {
        chat.style.display = 'flex';
    } else {
        chat.style.display = 'none';
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const message = input.value.trim();

    if (message) {
        // Benutzer Nachricht
        const userMsg = document.createElement('div');
        userMsg.style.cssText = `
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                            color: white !important; padding: 10px !important; border-radius: 10px !important;
                            margin-bottom: 10px !important; margin-left: 50px !important; text-align: right !important;
                        `;
        userMsg.textContent = message;
        messages.appendChild(userMsg);

        // AI Antwort
        setTimeout(() => {
            const aiMsg = document.createElement('div');
            aiMsg.style.cssText = `
                                background: #e9ecef !important; padding: 10px !important; border-radius: 10px !important;
                                margin-bottom: 10px !important; margin-right: 50px !important;
                            `;
            aiMsg.textContent = "Das ist eine interessante Frage! Als AI Teaching Assistant helfe ich Ihnen gerne weiter.";
            messages.appendChild(aiMsg);
            messages.scrollTop = messages.scrollHeight;
        }, 1000);

        input.value = '';
        messages.scrollTop = messages.scrollHeight;
    }
}

// Enter-Taste für Chat
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && document.getElementById('chatInput') === document.activeElement) {
        sendChatMessage();
    }
});

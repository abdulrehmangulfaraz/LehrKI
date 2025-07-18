
let allPrompts = []; // This will store all prompts fetched from the server

// --- INITIALIZATION ---
// This function runs automatically when the page has finished loading
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch all public prompts from our new backend endpoint
        const response = await fetch('/api/prompts/public');
        if (!response.ok) {
            throw new Error('Failed to load prompts from the server.');
        }
        allPrompts = await response.json();
        displayPrompts(allPrompts); // Display the fetched prompts
        console.log('Prompt Collection loaded successfully!');
    } catch (error) {
        console.error(error);
        const grid = document.getElementById('promptsGrid');
        grid.innerHTML = '<p style="color:red; text-align:center;">Could not load prompts. Please try again later.</p>';
    }
});

// --- DISPLAY AND FILTERING ---
// REPLACE your old displayPrompts function with this one

function displayPrompts(promptsToDisplay) {
    const featuredGrid = document.getElementById('featuredPromptsGrid');
    const mainGrid = document.getElementById('promptsGrid');

    // Clear both sections to start fresh
    featuredGrid.innerHTML = '';
    mainGrid.innerHTML = '';

    if (promptsToDisplay.length === 0) {
        mainGrid.innerHTML = '<p style="text-align:center; color: white;">No prompts found matching your criteria.</p>';
        return;
    }

    // --- 1. Populate the Featured Prompts Section ---
    // We'll take the first two prompts from the list to feature them
    const featuredPrompts = promptsToDisplay.slice(0, 2);

    featuredPrompts.forEach(prompt => {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        card.style.border = '2px solid #ffd700'; // Keep the featured styling
        card.innerHTML = `
                <div class="prompt-header">
                    <div>
                        <div class="prompt-title">${prompt.title}</div>
                        <div class="prompt-meta">
                            <span class="prompt-author">By ${prompt.owner.full_name}</span>
                            <span class="tag tag-${prompt.category.toLowerCase()}">${prompt.category}</span>
                        </div>
                    </div>
                </div>
                <div class="prompt-description">${prompt.text.substring(0, 100)}...</div>
                <div class="prompt-full-text" style="display:none;">${prompt.text}</div>
                <div class="prompt-actions">
                    <button class="btn btn-primary" onclick="viewPrompt(this)">View Full</button>
                    <button class="btn btn-secondary" onclick="copyPrompt(this)">Copy</button>
                </div>
            `;
        featuredGrid.appendChild(card);
    });

    // --- 2. Populate the Main Community Prompts Grid ---
    // We display ALL prompts in the main grid, including the featured ones
    promptsToDisplay.forEach(prompt => {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        card.dataset.category = prompt.category.toLowerCase();
        card.innerHTML = `
                <div class="prompt-header">
                    <div>
                        <div class="prompt-title">${prompt.title}</div>
                        <div class="prompt-meta">
                            <span class="prompt-author">By ${prompt.owner.full_name}</span>
                            <span class="tag tag-${prompt.category.toLowerCase()}">${prompt.category}</span>
                        </div>
                    </div>
                </div>
                <div class="prompt-description">${prompt.text.substring(0, 120)}...</div>
                <div class="prompt-full-text" style="display:none;">${prompt.text}</div>
                <div class="prompt-actions">
                    <button class="btn btn-primary" onclick="viewPrompt(this)">View Full</button>
                    <button class="btn btn-secondary" onclick="copyPrompt(this)">Copy</button>
                </div>
            `;
        mainGrid.appendChild(card);
    });
}


function filterPrompts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const activeCategory = document.querySelector('.filter-tag.active').dataset.category;

    const filtered = allPrompts.filter(prompt => {
        const matchesSearch = prompt.title.toLowerCase().includes(searchTerm) ||
            prompt.owner.full_name.toLowerCase().includes(searchTerm);
        const matchesCategory = activeCategory === 'all' || prompt.category.toLowerCase() === activeCategory;
        return matchesSearch && matchesCategory;
    });

    displayPrompts(filtered);
}

function filterByCategory(element, category) {
    document.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
    element.classList.add('active');
    element.dataset.category = category; // Set data-category for the active filter
    filterPrompts(); // Re-run the filter
}

// --- MODAL AND ACTIONS ---

function viewPrompt(button) {
    const card = button.closest('.prompt-card');
    const title = card.querySelector('.prompt-title').textContent;
    const author = card.querySelector('.prompt-author').textContent;
    const fullText = card.querySelector('.prompt-full-text').textContent;

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalAuthor').textContent = author;
    document.getElementById('modalPromptText').textContent = fullText;
    document.getElementById('promptModal').classList.add('show');
}

function copyPrompt(button) {
    const card = button.closest('.prompt-card');
    const fullText = card.querySelector('.prompt-full-text').textContent;
    navigator.clipboard.writeText(fullText).then(() => showCopySuccess());
}

function copyModalPrompt() {
    const promptText = document.getElementById('modalPromptText').textContent;
    navigator.clipboard.writeText(promptText).then(() => {
        document.getElementById('copySuccess').style.display = 'block';
        setTimeout(() => { document.getElementById('copySuccess').style.display = 'none'; }, 2000);
    });
}

function hidePromptModal() {
    document.getElementById('promptModal').classList.remove('show');
}

function showContributeModal() {
    // Redirect to dashboard where a logged-in user can create prompts
    window.location.href = '/dashboard.html';
}

function showCopySuccess() {
    const successMsg = document.createElement('div');
    successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 15px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 5px 15px rgba(0,0,0,0.3);';
    successMsg.textContent = '✅ Prompt copied to clipboard!';
    document.body.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 3000);
}

// Dummy functions for now
function toggleLike(button) { alert('Like functionality will be implemented in a future step.'); }
function sortPrompts(sortBy) { console.log('Sorting by:', sortBy); }


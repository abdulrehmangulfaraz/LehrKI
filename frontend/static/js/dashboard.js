
// --- MODAL AND NAVIGATION FUNCTIONS (WITH BUG FIX) ---

function showModal(modalType) {
    // Correctly find the modal ID (e.g., 'create-prompt' -> 'createPromptModal')
    const modalId = modalType.replace(/-(\w)/g, (match, letter) => letter.toUpperCase()) + 'Modal';
    const modal = document.getElementById(modalId);

    if (modal) {
        if (modalType === 'share-gpt') {
            document.getElementById('shareContentModal').classList.add('show');
            document.getElementById('contentType').value = 'gpt';
        } else {
            modal.classList.add('show');
        }
    } else {
        console.error(`Modal with ID "${modalId}" not found.`);
    }
}

function hideModal(modalType) {
    const modalId = modalType.replace(/-(\w)/g, (match, letter) => letter.toUpperCase()) + 'Modal';
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
}

// --- PAGE NAVIGATION AND INTERACTIVITY ---

let currentSection = 'dashboard';

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'block';
    }

    // --- NEW LOGIC: Fetch fresh data when a tab is clicked ---
    if (sectionId === 'dashboard') {
        // Refresh both counts when viewing the overview
        fetchAndDisplaySharedItems();
        fetchAndDisplayPrompts();
        fetchAndDisplaySharedItems();
    }
    if (sectionId === 'my-prompts') {
        fetchAndDisplayPrompts();
    }
    if (sectionId === 'shared-content') {
        fetchAndDisplaySharedItems();
        fetchAndDisplayCommunityFavorites();
    }
    // --- END OF NEW LOGIC ---

    // Update the active nav item in the sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const targetNav = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (targetNav) {
        targetNav.classList.add('active');
    }

    currentSection = sectionId;
}

function navigateToTool(toolName) {
    window.location.href = toolName + '.html';
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('accessToken');
        window.location.href = '/index.html';
    }
}

// --- PROMPT-RELATED FUNCTIONS ---

async function fetchAndDisplayPrompts() {
    const token = localStorage.getItem('accessToken');
    const promptListDiv = document.querySelector('#my-prompts .prompt-list');
    if (!token || !promptListDiv) return;

    try {
        const response = await fetch('/api/prompts/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch prompts');

        const prompts = await response.json();
        document.getElementById('createdPromptsCount').textContent = prompts.length;
        promptListDiv.innerHTML = ''; // Clear static content

        if (prompts.length === 0) {
            promptListDiv.innerHTML = '<p>You haven\'t created any prompts yet. Click "+ New Prompt" to get started!</p>';
        } else {
            prompts.forEach(prompt => {
                const promptElement = document.createElement('div');
                promptElement.className = 'prompt-item';
                promptElement.innerHTML = `
                        <div class="prompt-title">
                            <span>📝 ${prompt.title}</span>
                            <span class="tag">${prompt.category}</span>
                        </div>
                        <div class="prompt-text">${prompt.text}</div>
                        <div class="prompt-actions">
                            <button class="btn btn-small btn-primary" onclick="usePrompt('${prompt.text}')">Use</button>
                            <button class="btn btn-small btn-secondary" onclick="editPrompt(${prompt.id})">Edit</button>
                            <button class="btn btn-small btn-danger" onclick="deletePrompt(${prompt.id})">Delete</button>
                        </div>
                    `;
                promptListDiv.appendChild(promptElement);
            });
        }
    } catch (error) {
        console.error('Error fetching prompts:', error);
        promptListDiv.innerHTML = '<p style="color: red;">An error occurred while loading prompts.</p>';
    }
}

function usePrompt(promptText) {
    navigator.clipboard.writeText(promptText).then(() => {
        alert('Prompt copied to clipboard!');
    });
}

async function editPrompt(promptId) {
    const token = localStorage.getItem('accessToken');
    try {
        // Fetch the specific prompt's data from the backend
        const response = await fetch(`/api/prompts/${promptId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch prompt details.');

        const prompt = await response.json();

        // Populate the edit form with the fetched data
        document.getElementById('editPromptId').value = prompt.id;
        document.getElementById('editPromptTitle').value = prompt.title;
        document.getElementById('editPromptCategory').value = prompt.category;
        document.getElementById('editPromptText').value = prompt.text;

        // Show the edit modal
        showModal('edit-prompt');

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

async function deletePrompt(promptId) {
    // Ask for confirmation before deleting
    if (!confirm('Are you sure you want to permanently delete this prompt?')) {
        return;
    }

    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch(`/api/prompts/${promptId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete the prompt.');
        }

        alert('Prompt deleted successfully!');
        fetchAndDisplayPrompts(); // Refresh the dashboard to show the prompt is gone
        fetchAndDisplaySharedItems(); // Fetch and display user's shared items

    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Error deleting prompt:', error);
    }
}

// --- SHARED CONTENT FUNCTIONS ---

async function fetchAndDisplaySharedItems() {
    const token = localStorage.getItem('accessToken');
    const sharedListDiv = document.querySelector('#shared-content .shared-items');
    if (!token || !sharedListDiv) return;

    try {
        const response = await fetch('/api/shared-items/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch shared items.');

        const items = await response.json();
        document.getElementById('sharedItemsCount').textContent = items.length;
        sharedListDiv.innerHTML = ''; // Clear static items

        if (items.length === 0) {
            sharedListDiv.innerHTML = '<p>You haven\'t shared any content yet.</p>';
        } else {
            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'shared-item';
                itemElement.innerHTML = `
                        <div class="shared-info">
                            <div class="shared-title">${item.title}</div>
                            <div class="shared-meta">${item.content_type} • 0 likes • Just now</div>
                        </div>
                        <button class="btn btn-small btn-secondary" onclick="viewShared(${item.id})">View</button>
                    `;
                sharedListDiv.appendChild(itemElement);
            });
        }
    } catch (error) {
        console.error('Error fetching shared items:', error);
        sharedListDiv.innerHTML = '<p style="color: red;">Could not load shared items.</p>';
    }
}

// --- FORM SUBMISSION HANDLERS ---

// ADD THIS NEW BLOCK

document.getElementById('updateProfileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const fullName = document.getElementById('profileFullName').value;
    const alertDiv = document.getElementById('profileAlert');

    try {
        const response = await fetch('/api/users/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ full_name: fullName })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.detail || 'Failed to update profile.');

        // Update the name in the sidebar as well
        document.getElementById('userFullName').textContent = result.full_name;
        document.getElementById('welcomeHeader').textContent = `Welcome back, ${result.full_name.split(' ')[0]}! 👋`;
        document.getElementById('profileFullName').value = user.full_name;

        alertDiv.innerHTML = '<p style="color: green;">Profile updated successfully!</p>';
    } catch (error) {
        alertDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});

// Handler for the Update Password Form
document.getElementById('updatePasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    const alertDiv = document.getElementById('passwordAlert');

    if (newPassword !== confirmNewPassword) {
        alertDiv.innerHTML = '<p style="color: red;">New passwords do not match.</p>';
        return;
    }

    try {
        const response = await fetch('/api/users/me/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.detail || 'Failed to update password.');

        alertDiv.innerHTML = '<p style="color: green;">Password updated successfully!</p>';
        e.target.reset(); // Clear the form fields on success
    } catch (error) {
        alertDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});

document.getElementById('editPromptForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const promptId = document.getElementById('editPromptId').value;
    const title = document.getElementById('editPromptTitle').value;
    const category = document.getElementById('editPromptCategory').value;
    const text = document.getElementById('editPromptText').value;

    try {
        const response = await fetch(`/api/prompts/${promptId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, text, category })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to update prompt.');
        }

        alert('Prompt updated successfully!');
        hideModal('edit-prompt');
        fetchAndDisplayPrompts(); // Refresh the list to show the changes

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// The handler for createPromptForm should already be here
// ...

// --- PAGE INITIALIZATION AND AUTHENTICATION ---

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch('/api/auth/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Authentication failed');

        const user = await response.json();

        // Personalize page
        document.getElementById('userFullName').textContent = user.full_name;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('welcomeHeader').textContent = `Welcome back, ${user.full_name.split(' ')[0]}! 👋`;

        // Populate the read-only settings fields
        document.getElementById('settingsFullName').textContent = user.full_name;
        document.getElementById('settingsEmail').textContent = user.email;

        // Fetch user-specific content
        fetchAndDisplayPrompts();
        fetchAndDisplaySharedItems(); // ADD THIS LINE if it's missing
        fetchAndDisplayCommunityFavorites();

    } catch (error) {
        console.error('Initialization failed:', error);
        localStorage.removeItem('accessToken');
        window.location.href = '/login.html';
    }
});

async function fetchAndDisplayCommunityFavorites() {
    const communityListDiv = document.getElementById('communityFavoritesList');
    if (!communityListDiv) return;

    try {
        // We use the public endpoint that gets items from ALL users
        const response = await fetch('/api/shared-items/public');
        if (!response.ok) throw new Error('Failed to fetch community items.');

        const items = await response.json();
        communityListDiv.innerHTML = ''; // Clear static items

        if (items.length === 0) {
            communityListDiv.innerHTML = '<p>No community content has been shared yet.</p>';
        } else {
            // Display only the top 3 items as favorites for now
            items.slice(0, 3).forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'shared-item';
                itemElement.innerHTML = `
                        <div class="shared-info">
                            <div class="shared-title">${item.title}</div>
                            <div class="shared-meta">By ${item.owner.full_name} • ${item.content_type}</div>
                        </div>
                        <button class="btn btn-small btn-primary" onclick="useCommunityItem(${item.id})">Use</button>
                    `;
                communityListDiv.appendChild(itemElement);
            });
        }
    } catch (error) {
        console.error('Error fetching community items:', error);
        communityListDiv.innerHTML = '<p style="color: red;">Could not load community items.</p>';
    }
}

// --- FORM SUBMISSION HANDLERS ---

document.getElementById('createPromptForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const title = document.getElementById('promptTitle').value;
    const category = document.getElementById('promptCategory').value;
    const text = document.getElementById('promptText').value;

    try {
        const response = await fetch('/api/prompts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, text, category })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to create prompt.');
        }

        alert('Prompt created successfully!');
        hideModal('create-prompt');
        e.target.reset();
        fetchAndDisplayPrompts(); // Refresh the list

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

document.getElementById('shareContentForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    const itemData = {
        title: document.getElementById('contentTitle').value,
        content_type: document.getElementById('contentType').value,
        url: document.getElementById('contentUrl').value,
        description: document.getElementById('contentDescription').value,
    };

    try {
        const response = await fetch('/api/shared-items/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(itemData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to share content.');
        }

        alert('Content shared successfully!');
        hideModal('share-content');
        e.target.reset();
        fetchAndDisplaySharedItems(); // Refresh the list of shared items
        fetchAndDisplayCommunityFavorites();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === this) this.classList.remove('show');
    });
});

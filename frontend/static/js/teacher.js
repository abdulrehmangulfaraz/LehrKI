
// Navigation
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(el => {
        el.style.display = 'none';
    });

    // Show selected section
    document.getElementById(section + '-section').style.display = 'block';

    // Update nav active state
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

// Toggle tool switches
document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function () {
        const card = this.closest('.tool-card');
        if (this.checked) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
});

// Simulate share link functionality
document.querySelectorAll('.action-icon').forEach(icon => {
    if (icon.title === 'Share Link') {
        icon.addEventListener('click', function () {
            const link = 'https://languagelearning.hub/practice/abc123xyz';
            navigator.clipboard.writeText(link);
            alert('Practice link copied to clipboard:\n' + link);
        });
    }
});

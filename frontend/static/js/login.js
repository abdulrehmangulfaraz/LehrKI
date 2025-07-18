

let selectedUserType = 'teacher';

function selectUserType(type) {
    selectedUserType = type;
    document.querySelectorAll('.user-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function showAlert(message, type = 'error') {
    const alertDiv = document.getElementById('loginAlert');
    alertDiv.textContent = message;
    alertDiv.className = `alert ${type}`;
    alertDiv.style.display = 'block';
}

function goBack() {
    window.location.href = 'index.html';
}

function showForgotPassword() {
    showAlert('Password reset functionality will be implemented in a future step.', 'success');
}

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Prepare the form data for the backend in the correct format
    const formData = new URLSearchParams();
    formData.append('username', email); // The backend expects 'username'
    formData.append('password', password);

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        });

        const result = await response.json();

        if (response.ok) {
            // On success, save the token and redirect
            localStorage.setItem('accessToken', result.access_token);
            showAlert('Login successful! Redirecting...', 'success');

            // Redirect to the correct dashboard after a short delay
            setTimeout(() => {
                window.location.href = (result.user_role === 'admin')
                    ? '/admin-dashboard.html'
                    : '/dashboard.html';
            }, 1000);

        } else {
            // On failure, show the specific error from the backend
            showAlert(result.detail || 'An unknown error occurred.', 'error');
        }
    } catch (error) {
        showAlert('Could not connect to the server. Please ensure the backend is running.', 'error');
        console.error('Login fetch error:', error);
    }
});

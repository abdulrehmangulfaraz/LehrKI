// --- AUTHENTICATION AND DATA LOADING ---

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    document.getElementById('loadingScreen').classList.remove('hidden');
    verifyAdminAndLoadData(token);
    setupEventListeners(); // Setup all event listeners
});

async function verifyAdminAndLoadData(token) {
    try {
        const userResponse = await fetch('/api/auth/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!userResponse.ok) throw new Error('Authentication failed.');

        const user = await userResponse.json();
        if (user.role !== 'admin') {
            alert('Access denied. You must be an admin to view this page.');
            window.location.href = '/dashboard.html';
            return;
        }

        await fetchAllUsers(token);

    } catch (error) {
        console.error('Error during page load:', error);
        localStorage.removeItem('accessToken');
        window.location.href = '/login.html';
    } finally {
        setTimeout(() => {
            document.getElementById('loadingScreen').classList.add('hidden');
        }, 500);
    }
}

async function fetchAllUsers(token) {
    const tableBody = document.getElementById('userManagementTableBody');
    if (!tableBody) return;

    try {
        const response = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch user list.');

        const users = await response.json();
        tableBody.innerHTML = '';

        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No users found.</td></tr>';
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            const statusClass = user.is_active ? 'status-active' : 'status-inactive';
            const statusText = user.is_active ? 'Active' : 'Inactive';
            const userInitial = user.full_name ? user.full_name.charAt(0).toUpperCase() : '?';

            row.innerHTML = `
                <td>
                    <div class="table-user">
                        <div class="table-avatar">${userInitial}</div>
                        <div class="table-user-info">
                            <div class="table-user-name">${user.full_name}</div>
                            <div class="table-user-email">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>${user.role}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editUser(${user.id})">✏️ Edit</button>
                        <button class="action-btn delete" onclick="deleteUser(${user.id})">🗑️ Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to display users:', error);
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Could not load user data.</td></tr>';
    }
}

// --- USER MANAGEMENT FUNCTIONS (EDIT, DELETE, ADD) ---

async function editUser(userId) {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Could not fetch user data.');
        const user = await response.json();

        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserFullName').value = user.full_name;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserRole').value = user.role;
        document.getElementById('editUserStatus').value = user.is_active.toString();

        showModal('editUserModal');
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

async function deleteUser(userId) {
    if (!confirm(`Are you sure you want to permanently delete user ID ${userId}?`)) {
        return;
    }
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete user.');
        alert('User deleted successfully.');
        await fetchAllUsers(token);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

function addUser() {
    document.getElementById('addUserForm').reset();
    showModal('addUserModal');
}

// --- UI AND NAVIGATION FUNCTIONS ---

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const targetNav = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (targetNav) targetNav.classList.add('active');
    updateBreadcrumb(sectionId);
}

function updateBreadcrumb(sectionId) {
    const breadcrumb = document.getElementById('breadcrumb-current');
    const sectionNames = {
        'overview': 'Overview',
        'realtime': 'Real-Time Monitor',
        'analytics': 'Analytics & Reports',
        'users': 'All Users',
        'roles': 'Roles & Permissions',
        'activity': 'User Activity',
        'sessions': 'Active Sessions',
        'prompts': 'Prompt Library',
        'moderation': 'Content Moderation',
        'ai-config': 'AI Configuration',
        'tools': 'Tool Management',
        'security': 'Security Center',
        'audit': 'Audit Logs',
        'firewall': 'Firewall & IPs',
        'api-keys': 'API Management',
        'subscriptions': 'Subscriptions',
        'invoices': 'Invoices',
        'revenue': 'Revenue Reports',
        'settings': 'General Settings',
        'database': 'Database',
        'integrations': 'Integrations',
        'backups': 'Backup & Recovery',
        'system-logs': 'System Logs',
        'tickets': 'Support Tickets',
        'feedback': 'User Feedback',
        'announcements': 'Announcements'
    };
    if (breadcrumb) {
        breadcrumb.textContent = sectionNames[sectionId] || 'Dashboard';
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function searchMenu(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.nav-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'flex' : 'none';
    });
}

function switchTab(tabElement, tabId) {
    tabElement.parentElement.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    tabElement.classList.add('active');
    // In a real app, you'd filter the user list here based on the tab
    console.log('Filtering users by:', tabId);
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('show');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('accessToken');
        window.location.href = '/index.html';
    }
}

// --- EVENT LISTENERS ---

function setupEventListeners() {
    // Edit User Form Submission
    document.getElementById('editUserForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        const userId = document.getElementById('editUserId').value;
        const alertDiv = document.getElementById('editUserAlert');
        alertDiv.innerHTML = '';

        const updatedData = {
            full_name: document.getElementById('editUserFullName').value,
            role: document.getElementById('editUserRole').value,
            is_active: document.getElementById('editUserStatus').value === 'true'
        };

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to update user.');
            }
            alert('User updated successfully!');
            hideModal('editUserModal');
            await fetchAllUsers(token);
        } catch (error) {
            alertDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    });

    // Add User Form Submission
    document.getElementById('addUserForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        const alertDiv = document.getElementById('addUserAlert');
        alertDiv.innerHTML = '';

        const userData = {
            full_name: document.getElementById('add-full-name').value,
            email: document.getElementById('add-email').value,
            password: document.getElementById('add-password').value,
            role: document.getElementById('add-role').value
        };

        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                 const err = await response.json();
                throw new Error(err.detail || 'Failed to add user.');
            }
            alert('User added successfully!');
            hideModal('addUserModal');
            await fetchAllUsers(token);
        } catch (error) {
             alertDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    });
}
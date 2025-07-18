// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 1000);

    // Start real-time updates
    startRealTimeUpdates();

    // Initialize charts
    initializeCharts();

    // Setup event listeners
    setupEventListeners();
});

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Set active nav item
    const targetNav = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (targetNav) {
        targetNav.classList.add('active');
    }

    // Update breadcrumb
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

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Search Menu
function searchMenu(query) {
    const navItems = document.querySelectorAll('.nav-item');
    const q = query.toLowerCase();

    navItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(q)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Tab Switching
function switchTab(tabElement, tabId) {
    // Remove active class from all tabs
    tabElement.parentElement.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add active class to clicked tab
    tabElement.classList.add('active');

    // Show/hide tab content
    console.log('Switching to tab:', tabId);
}

// Modal Functions
function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function saveModal() {
    // Save modal data
    console.log('Saving modal data...');
    closeModal();
}

// Alert Functions
function dismissAlert(element) {
    element.parentElement.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        element.parentElement.remove();
    }, 300);
}

// User Management Functions
function addUser() {
    const content = `
                <form>
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input type="text" class="form-control" placeholder="John Doe">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email Address</label>
                        <input type="email" class="form-control" placeholder="john@example.com">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Role</label>
                        <select class="form-control form-select">
                            <option>Basic User</option>
                            <option>Teacher</option>
                            <option>Premium User</option>
                            <option>Administrator</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Initial Password</label>
                        <input type="password" class="form-control" placeholder="••••••••">
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="sendWelcome">
                        <label for="sendWelcome">Send welcome email</label>
                    </div>
                </form>
            `;
    showModal('Add New User', content);
}

function viewUser(userId) {
    console.log('Viewing user:', userId);
    // Would show user details modal
}

function editUser(userId) {
    console.log('Editing user:', userId);
    // Would show edit modal
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        console.log('Deleting user:', userId);
        // Would delete user
    }
}

function approveUser(userId) {
    console.log('Approving user:', userId);
    // Would approve user
}

function rejectUser(userId) {
    if (confirm('Are you sure you want to reject this user?')) {
        console.log('Rejecting user:', userId);
        // Would reject user
    }
}

// Real-time Updates
function startRealTimeUpdates() {
    // Update stats every 5 seconds
    setInterval(updateStats, 5000);

    // Update activity feed every 10 seconds
    setInterval(updateActivityFeed, 10000);

    // Update system console
    setInterval(updateSystemConsole, 2000);
}

function updateStats() {
    // Simulate stat updates
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        if (stat.textContent.includes('%')) {
            const current = parseFloat(stat.textContent);
            const change = (Math.random() - 0.5) * 2;
            const newValue = Math.max(0, Math.min(100, current + change));
            stat.textContent = newValue.toFixed(1) + '%';
        }
    });
}

function updateActivityFeed() {
    // Would fetch new activity items
    console.log('Updating activity feed...');
}

function updateSystemConsole() {
    const console = document.getElementById('systemConsole');
    if (console) {
        const messages = [
            { level: 'info', text: 'Health check completed' },
            { level: 'success', text: 'Cache cleared successfully' },
            { level: 'warning', text: 'API rate limit approaching' },
            { level: 'error', text: 'Failed to connect to backup server' },
            { level: 'info', text: 'New user registered' },
            { level: 'success', text: 'Email queue processed' }
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const time = new Date().toTimeString().split(' ')[0];

        const newLine = document.createElement('div');
        newLine.className = 'console-line';
        newLine.innerHTML = `
                    <span class="console-time">${time}</span>
                    <span class="console-level ${randomMessage.level}">[${randomMessage.level.toUpperCase()}]</span>
                    <span>${randomMessage.text}</span>
                `;

        console.appendChild(newLine);
        console.scrollTop = console.scrollHeight;

        // Keep only last 20 lines
        while (console.children.length > 20) {
            console.removeChild(console.firstChild);
        }
    }
}

// Chart Initialization
function initializeCharts() {
    // Would initialize Chart.js or similar
    console.log('Initializing charts...');
}

// Event Listeners
function setupEventListeners() {
    // Close modal on outside click
    document.getElementById('modalOverlay').addEventListener('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.querySelector('.search-box input').focus();
        }

        // Escape to close modal
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Utility Functions
function showNotifications() {
    const content = `
                <div class="activity-feed">
                    <div class="activity-item">
                        <div class="activity-icon warning">⚠️</div>
                        <div class="activity-content">
                            <div class="activity-title">High Server Load</div>
                            <div class="activity-description">CPU usage exceeded threshold</div>
                            <div class="activity-time">5 minutes ago</div>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon user">👤</div>
                        <div class="activity-content">
                            <div class="activity-title">New Premium Signup</div>
                            <div class="activity-description">alice@example.com upgraded</div>
                            <div class="activity-time">15 minutes ago</div>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon content">💭</div>
                        <div class="activity-content">
                            <div class="activity-title">Content Flagged</div>
                            <div class="activity-description">Review required for new prompt</div>
                            <div class="activity-time">1 hour ago</div>
                        </div>
                    </div>
                </div>
            `;
    showModal('Notifications', content);
}

function showQuickActions() {
    const content = `
                <div style="display: grid; gap: 15px;">
                    <button class="btn btn-primary" onclick="quickBackup()">
                        💾 Quick Backup
                    </button>
                    <button class="btn btn-warning" onclick="clearCache()">
                        🗑️ Clear Cache
                    </button>
                    <button class="btn btn-danger" onclick="emergencyMode()">
                        🚨 Emergency Mode
                    </button>
                    <button class="btn btn-success" onclick="runHealthCheck()">
                        🏥 Health Check
                    </button>
                    <button class="btn btn-secondary" onclick="exportReports()">
                        📊 Export Reports
                    </button>
                </div>
            `;
    showModal('Quick Actions', content);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    // Save theme preference
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Quick Action Functions
function quickBackup() {
    if (confirm('Start immediate backup? This may affect performance temporarily.')) {
        alert('Backup initiated. You will be notified when complete.');
        closeModal();
    }
}

function clearCache() {
    if (confirm('Clear all system caches? This will improve performance but may cause temporary slowdowns.')) {
        alert('Cache cleared successfully!');
        closeModal();
    }
}

function emergencyMode() {
    if (confirm('🚨 ACTIVATE EMERGENCY MODE? This will:\n\n• Block all new users\n• Disable API access\n• Enable read-only mode\n• Alert all administrators\n\nContinue?')) {
        alert('🚨 EMERGENCY MODE ACTIVATED');
        closeModal();
        // Update UI to show emergency state
        document.querySelector('.live-indicator').innerHTML = `
                    <span class="live-dot" style="background: red;"></span>
                    <span style="color: red;">EMERGENCY MODE</span>
                `;
    }
}

function runHealthCheck() {
    alert('Running comprehensive health check...\n\n✅ Database: OK\n✅ API: OK\n⚠️ Storage: 82% used\n✅ Email: OK\n✅ Cache: OK');
    closeModal();
}

function exportReports() {
    const content = `
                <form>
                    <div class="form-group">
                        <label class="form-label">Report Type</label>
                        <select class="form-control form-select">
                            <option>User Analytics</option>
                            <option>Revenue Report</option>
                            <option>System Performance</option>
                            <option>Security Audit</option>
                            <option>Complete Export</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date Range</label>
                        <select class="form-control form-select">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last quarter</option>
                            <option>Last year</option>
                            <option>Custom range</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Format</label>
                        <select class="form-control form-select">
                            <option>PDF</option>
                            <option>Excel</option>
                            <option>CSV</option>
                            <option>JSON</option>
                        </select>
                    </div>
                </form>
            `;
    showModal('Export Reports', content);
}

// Additional Functions
function refreshHealth() {
    console.log('Refreshing system health...');
    // Animate progress bars
    document.querySelectorAll('.progress-fill').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

function expandHealth() {
    showSection('realtime');
}

function filterActivity() {
    const content = `
                <form>
                    <div class="form-group">
                        <label class="form-label">Activity Type</label>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="actUser" checked>
                            <label for="actUser">User Activities</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="actContent" checked>
                            <label for="actContent">Content Activities</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="actSystem" checked>
                            <label for="actSystem">System Events</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="actSecurity" checked>
                            <label for="actSecurity">Security Alerts</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Time Range</label>
                        <select class="form-control form-select">
                            <option>Last hour</option>
                            <option>Last 24 hours</option>
                            <option>Last week</option>
                            <option>Last month</option>
                        </select>
                    </div>
                </form>
            `;
    showModal('Filter Activity', content);
}

function viewAllActivity() {
    showSection('activity');
}

function exportMetrics() {
    if (confirm('Export current metrics as CSV?')) {
        console.log('Exporting metrics...');
        alert('Metrics exported successfully!');
    }
}

function clearAlerts() {
    if (confirm('Clear all system alerts?')) {
        document.querySelector('.alerts-container').innerHTML = `
                    <div class="alert alert-info">
                        <span class="alert-icon">ℹ️</span>
                        <div class="alert-content">
                            <div class="alert-title">No Active Alerts</div>
                            <div>All systems operating normally</div>
                        </div>
                    </div>
                `;
    }
}

function editPasswordPolicy() {
    const content = `
                <form>
                    <div class="form-group">
                        <label class="form-label">Minimum Length</label>
                        <input type="number" class="form-control" value="12" min="8" max="32">
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="reqUpper" checked>
                        <label for="reqUpper">Require uppercase letters</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="reqLower" checked>
                        <label for="reqLower">Require lowercase letters</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="reqNumbers" checked>
                        <label for="reqNumbers">Require numbers</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="reqSymbols" checked>
                        <label for="reqSymbols">Require special characters</label>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password Expiry (days)</label>
                        <input type="number" class="form-control" value="90" min="0">
                        <small style="color: #666;">Set to 0 to disable expiry</small>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Previous Passwords to Remember</label>
                        <input type="number" class="form-control" value="5" min="0" max="24">
                    </div>
                </form>
            `;
    showModal('Password Policy Settings', content);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to login
        window.location.href = 'index.html';
    }
}

// Initialize theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Performance monitoring
function monitorPerformance() {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
}

// Error handling
window.addEventListener('error', function (e) {
    console.error('Global error:', e.error);
    // Would send to error tracking service
});

// Auto-save functionality
let autoSaveTimer;
document.addEventListener('input', function (e) {
    if (e.target.matches('input, textarea, select')) {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            console.log('Auto-saving form data...');
            // Would save to localStorage or server
        }, 2000);
    }
});

// Keyboard navigation
let commandMode = false;
document.addEventListener('keydown', function (e) {
    // Cmd/Ctrl + / for command palette
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        showCommandPalette();
    }

    // Quick number navigation
    if (commandMode && e.key >= '1' && e.key <= '9') {
        const sections = ['overview', 'realtime', 'analytics', 'users', 'security', 'settings'];
        const index = parseInt(e.key) - 1;
        if (sections[index]) {
            showSection(sections[index]);
            commandMode = false;
        }
    }
});

function showCommandPalette() {
    const content = `
                <input type="text" class="form-control" placeholder="Type a command..." autofocus onkeyup="searchCommands(this.value)">
                <div id="commandResults" style="margin-top: 15px;">
                    <div class="command-item" onclick="showSection('overview'); closeModal();">
                        <strong>Go to Overview</strong> - View dashboard overview
                    </div>
                    <div class="command-item" onclick="showSection('users'); closeModal();">
                        <strong>Manage Users</strong> - User management panel
                    </div>
                    <div class="command-item" onclick="quickBackup(); closeModal();">
                        <strong>Backup Now</strong> - Create system backup
                    </div>
                    <div class="command-item" onclick="showSection('security'); closeModal();">
                        <strong>Security Center</strong> - View security settings
                    </div>
                </div>
                <style>
                    .command-item {
                        padding: 10px;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: background 0.2s;
                    }
                    .command-item:hover {
                        background: rgba(231, 76, 60, 0.1);
                    }
                </style>
            `;
    showModal('Command Palette', content);
}

function searchCommands(query) {
    // Would implement fuzzy search through commands
    console.log('Searching commands:', query);
}

// WebSocket for real-time updates (simulation)
function initWebSocket() {
    console.log('Initializing WebSocket connection...');
    // In production, this would be:
    // const ws = new WebSocket('wss://api.ai-teacher.com/admin/live');
    // ws.onmessage = (event) => { handleLiveUpdate(event.data); };
}

// Check for updates
function checkForUpdates() {
    fetch('/api/version')
        .then(response => response.json())
        .then(data => {
            if (data.updateAvailable) {
                const alert = document.createElement('div');
                alert.className = 'alert alert-info';
                alert.innerHTML = `
                            <span class="alert-icon">🆕</span>
                            <div class="alert-content">
                                <div class="alert-title">Update Available</div>
                                <div>Version ${data.version} is ready to install</div>
                            </div>
                            <span class="alert-close" onclick="dismissAlert(this)">✕</span>
                        `;
                document.querySelector('.alerts-container')?.appendChild(alert);
            }
        })
        .catch(err => console.error('Update check failed:', err));
}

// Initialize everything
monitorPerformance();
initWebSocket();
checkForUpdates();

// Periodic tasks
setInterval(checkForUpdates, 3600000); // Check for updates hourly

console.log('Admin Dashboard initialized successfully!');



// --- AUTHENTICATION AND DATA LOADING ---

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    verifyAdminAndLoadData(token);
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

        // If user is an admin, load all necessary data
        fetchAllUsers(token);
        // You can add other data loading functions here in the future

    } catch (error) {
        console.error('Error during page load:', error);
        localStorage.removeItem('accessToken');
        window.location.href = '/login.html';
    }
}

async function fetchAllUsers(token) {
    const tableBody = document.getElementById('userManagementTableBody');
    try {
        const response = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch user list.');

        const users = await response.json();
        tableBody.innerHTML = ''; // Clear placeholder rows

        users.forEach(user => {
            const row = document.createElement('tr');
            const statusClass = user.is_active ? 'status-active' : 'status-inactive';

            // Note the correct class names for buttons
            row.innerHTML = `
                    <td>
                        <div class="table-user">
                            <div class="table-avatar">${user.full_name.charAt(0)}</div>
                            <div class="table-user-info">
                                <div class="table-user-name">${user.full_name}</div>
                                <div class="table-user-email">${user.email}</div>
                            </div>
                        </div>
                    </td>
                    <td>${user.role}</td>
                    <td><span class="status-badge ${statusClass}">${user.is_active ? 'Active' : 'Inactive'}</span></td>
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
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Could not load user data.</td></tr>';
    }
}

// --- USER MANAGEMENT FUNCTIONS (EDIT & DELETE) ---

async function editUser(userId) {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Could not fetch user data.');

        const user = await response.json();

        // Populate the edit form
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserFullName').value = user.full_name;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserRole').value = user.role;
        document.getElementById('editUserStatus').value = user.is_active.toString();

        // Show the modal using the correct function
        showModal('editUserModal');
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

async function deleteUser(userId) {
    if (!confirm(`Are you sure you want to delete user ID ${userId}? This action cannot be undone.`)) {
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
        fetchAllUsers(token); // Refresh the user list
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

function addUser() {
    alert('Add User functionality will be implemented in a future step.');
}

// --- FORM SUBMISSION HANDLER ---

document.getElementById('editUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const userId = document.getElementById('editUserId').value;

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

        if (!response.ok) throw new Error('Failed to update user.');

        alert('User updated successfully!');
        hideModal('editUserModal');
        fetchAllUsers(token); // Refresh list
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// --- MODAL, NAVIGATION, AND LOGOUT HELPERS ---

// --- MODAL AND LOGOUT HELPERS ---

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Your modals use the .show class to appear
        modal.classList.add('show');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// This is the correct close function for your modal structure
function closeModal() {
    document.querySelector('.modal-overlay.active')?.classList.remove('active');
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.classList.add('active');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('accessToken');
        window.location.href = '/index.html';
    }
}

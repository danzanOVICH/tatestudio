// User Management JavaScript
const API_BASE_URL = CONFIG.API_BASE_URL;

let currentEditingUserId = null;
let isCurrentUserAdmin = false;

document.addEventListener('DOMContentLoaded', function () {
    // Check if current user is admin
    checkAdminStatus();

    loadUsers();

    // Setup form submission
    document.getElementById('userForm').addEventListener('submit', handleFormSubmit);
});

function checkAdminStatus() {
    const sessionData = localStorage.getItem('tateStudioSession');
    if (sessionData) {
        const session = JSON.parse(sessionData);
        isCurrentUserAdmin = session.isAdmin || false;

        // Hide create button if not admin
        const createButton = document.querySelector('.btn-primary');
        if (!isCurrentUserAdmin && createButton) {
            createButton.style.display = 'none';
        }
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/users`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('ユーザー一覧の取得に失敗しました');
        }

        const data = await response.json();
        displayUsers(data.users);
    } catch (error) {
        console.error('Error loading users:', error);
        showError(error.message);
        document.getElementById('usersTableBody').innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #ef4444;">
                    エラー: ${error.message}
                </td>
            </tr>
        `;
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');

    if (!users || users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #6b7280;">
                    ユーザーが見つかりません
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${escapeHtml(user.full_name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${formatDate(user.created_at)}</td>
            <td>
                <span class="badge ${user.is_active ? 'badge-active' : 'badge-inactive'}">
                    ${user.is_active ? 'アクティブ' : '無効'}
                </span>
            </td>
            <td>
                ${user.is_admin ? '<span class="badge badge-admin">管理者</span>' : 'ユーザー'}
            </td>
            <td>
                ${isCurrentUserAdmin ? `
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-edit" onclick="openEditModal('${user.user_id}')">
                            編集
                        </button>
                        <button class="btn btn-sm btn-delete" onclick="deleteUser('${user.user_id}', '${escapeHtml(user.full_name)}')">
                            削除
                        </button>
                    </div>
                ` : '<span style="color: #9ca3af;">-</span>'}
            </td>
        </tr>
    `).join('');
}

function openCreateModal() {
    if (!isCurrentUserAdmin) {
        alert('管理者のみがユーザーを作成できます');
        return;
    }

    currentEditingUserId = null;
    document.getElementById('modalTitle').textContent = '新規ユーザー追加';
    document.getElementById('passwordHint').textContent = '(8文字以上) *';
    document.getElementById('password').required = true;

    // Reset form
    document.getElementById('userForm').reset();
    document.getElementById('isActive').checked = true;
    document.getElementById('isAdmin').checked = false;

    document.getElementById('userModal').classList.add('active');
}

async function openEditModal(userId) {
    if (!isCurrentUserAdmin) {
        alert('管理者のみがユーザーを編集できます');
        return;
    }

    currentEditingUserId = userId;
    document.getElementById('modalTitle').textContent = 'ユーザー編集';
    document.getElementById('passwordHint').textContent = '(変更する場合のみ入力)';
    document.getElementById('password').required = false;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('ユーザー情報の取得に失敗しました');
        }

        const user = await response.json();

        // Populate form
        document.getElementById('fullName').value = user.full_name;
        document.getElementById('email').value = user.email;
        document.getElementById('password').value = '';
        document.getElementById('isActive').checked = user.is_active;
        document.getElementById('isAdmin').checked = user.is_admin;

        document.getElementById('userModal').classList.add('active');
    } catch (error) {
        console.error('Error loading user:', error);
        showError(error.message);
    }
}

function closeModal() {
    document.getElementById('userModal').classList.remove('active');
    currentEditingUserId = null;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isActive = document.getElementById('isActive').checked;
    const isAdmin = document.getElementById('isAdmin').checked;

    try {
        if (currentEditingUserId) {
            // Update existing user
            await updateUser(currentEditingUserId, {
                full_name: fullName,
                email: email,
                password: password || null,
                is_active: isActive,
                is_admin: isAdmin
            });
        } else {
            // Create new user
            await createUser({
                full_name: fullName,
                email: email,
                password: password,
                is_admin: isAdmin
            });
        }

        closeModal();
        loadUsers();
    } catch (error) {
        console.error('Error saving user:', error);
        showError(error.message);
    }
}

async function createUser(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'ユーザーの作成に失敗しました');
    }

    return await response.json();
}

async function updateUser(userId, userData) {
    // Remove null values
    const cleanData = {};
    for (const [key, value] of Object.entries(userData)) {
        if (value !== null && value !== '') {
            cleanData[key] = value;
        }
    }

    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(cleanData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'ユーザーの更新に失敗しました');
    }

    return await response.json();
}

async function deleteUser(userId, userName) {
    if (!isCurrentUserAdmin) {
        alert('管理者のみがユーザーを削除できます');
        return;
    }

    if (!confirm(`本当に「${userName}」を削除しますか？この操作は取り消せません。`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'ユーザーの削除に失敗しました');
        }

        loadUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        showError(error.message);
    }
}

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = `
        <div class="error-message">
            ${escapeHtml(message)}
        </div>
    `;

    setTimeout(() => {
        errorContainer.innerHTML = '';
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    const modal = document.getElementById('userModal');
    if (e.target === modal) {
        closeModal();
    }
});

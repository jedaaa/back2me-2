// ========================================
// BACK2ME - SETTINGS PAGE LOGIC
// ========================================

// Check authentication
const currentUser = checkAuth();
document.getElementById('currentUsername').textContent = currentUser.username;

// ===== LOAD USER PROFILE =====
document.getElementById('profileUsername').value = currentUser.username;
document.getElementById('profileEmail').value = currentUser.email;

// ===== CHANGE PASSWORD FORM =====
const changePasswordForm = document.getElementById('changePasswordForm');

changePasswordForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    // Validate
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        alert('Please fill in all password fields');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('back2me_users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex === -1) {
        alert('User not found');
        return;
    }
    
    // Verify current password
    if (users[userIndex].password !== currentPassword) {
        alert('Current password is incorrect');
        return;
    }
    
    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem('back2me_users', JSON.stringify(users));
    
    // Clear form
    changePasswordForm.reset();
    
    alert('Password changed successfully!');
});

// ===== PROFILE PICTURE UPLOAD =====
const profilePicture = document.getElementById('profilePicture');
const currentProfilePic = document.getElementById('currentProfilePic');

profilePicture.addEventListener('change', (event) => {
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            currentProfilePic.src = e.target.result;
            
            // Store in localStorage (in real app, upload to server)
            localStorage.setItem('back2me_profile_pic_' + currentUser.userId, e.target.result);
            
            alert('Profile picture updated!');
        };
        
        reader.readAsDataURL(file);
    }
});

// Load saved profile picture if exists
const savedPic = localStorage.getItem('back2me_profile_pic_' + currentUser.userId);
if (savedPic) {
    currentProfilePic.src = savedPic;
}

// ===== LOGOUT =====
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('back2me_session');
        sessionStorage.removeItem('back2me_session');
        window.location.href = 'login.html';
    }
});

// ===== AUTH CHECK =====
function checkAuth() {
    const session = localStorage.getItem('back2me_session') || 
                   sessionStorage.getItem('back2me_session');
    
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    
    return JSON.parse(session);
}

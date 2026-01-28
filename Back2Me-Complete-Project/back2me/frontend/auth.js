// ========================================
// BACK2ME - AUTHENTICATION LOGIC
// ========================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== LOGIN FORM =====
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // ===== REGISTER FORM =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // ===== FORGOT PASSWORD FORM =====
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
});

// ===== LOGIN HANDLER =====
function handleLogin(event) {
    event.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    let isValid = true;
    
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Simulate API call (replace with actual backend call)
    simulateLogin(email, password, rememberMe);
}

// ===== REGISTER HANDLER =====
function handleRegister(event) {
    event.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    let isValid = true;
    
    if (username.length < 3) {
        showError('usernameError', 'Username must be at least 3 characters');
        isValid = false;
    }
    
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Simulate API call (replace with actual backend call)
    simulateRegister(username, email, password);
}

// ===== FORGOT PASSWORD HANDLER =====
function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    // Clear previous errors
    clearErrors();
    
    // Validate email
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        return;
    }
    
    // Simulate API call (replace with actual backend call)
    simulateForgotPassword(email);
}

// ===== VALIDATION FUNCTIONS =====
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
}

// ===== SIMULATED API CALLS =====
// Replace these with actual backend API calls

function simulateLogin(email, password, rememberMe) {
    // Simulate network delay
    setTimeout(() => {
        // Check if user exists in localStorage (for demo purposes)
        const users = JSON.parse(localStorage.getItem('back2me_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store session
            const sessionData = {
                userId: user.id,
                username: user.username,
                email: user.email,
                timestamp: Date.now()
            };
            
            if (rememberMe) {
                localStorage.setItem('back2me_session', JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem('back2me_session', JSON.stringify(sessionData));
            }
            
            // Redirect to home page
            window.location.href = 'home.html';
        } else {
            showError('passwordError', 'Invalid email or password');
        }
    }, 500);
}

function simulateRegister(username, email, password) {
    // Simulate network delay
    setTimeout(() => {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('back2me_users') || '[]');
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
            showError('emailError', 'Email already registered');
            return;
        }
        
        // Check if username already exists
        if (users.some(u => u.username === username)) {
            showError('usernameError', 'Username already taken');
            return;
        }
        
        // Create new user
        const newUser = {
            id: generateUserId(),
            username: username,
            email: email,
            password: password, // In real app, this should be hashed
            createdAt: Date.now()
        };
        
        // Add user to storage
        users.push(newUser);
        localStorage.setItem('back2me_users', JSON.stringify(users));
        
        // Show success and redirect
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    }, 500);
}

function simulateForgotPassword(email) {
    // Simulate network delay
    setTimeout(() => {
        // In a real app, this would send an email
        const confirmationMessage = document.getElementById('confirmationMessage');
        if (confirmationMessage) {
            confirmationMessage.style.display = 'block';
        }
        
        // Hide form
        document.getElementById('forgotPasswordForm').style.opacity = '0.5';
        document.getElementById('forgotPasswordForm').style.pointerEvents = 'none';
    }, 500);
}

// ===== UTILITY FUNCTIONS =====
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===== CHECK IF USER IS LOGGED IN =====
function checkAuth() {
    const session = localStorage.getItem('back2me_session') || 
                   sessionStorage.getItem('back2me_session');
    
    if (!session) {
        window.location.href = 'login.html';
    }
    
    return JSON.parse(session);
}

// ===== LOGOUT FUNCTION =====
function logout() {
    localStorage.removeItem('back2me_session');
    sessionStorage.removeItem('back2me_session');
    window.location.href = 'login.html';
}

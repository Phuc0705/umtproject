// Authentication Management

// Check authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const result = await response.json();
        
        if (result.isLoggedIn) {
            currentUser = result.user;
            updateAuthDisplay();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

// Update authentication display
function updateAuthDisplay() {
    const authLink = document.querySelector('[data-bs-target="#loginModal"]');
    if (currentUser && authLink) {
        authLink.textContent = currentUser.username;
        authLink.onclick = logout;
    } else if (authLink) {
        authLink.textContent = 'Đăng nhập';
        authLink.onclick = null;
    }
}

// Login function
async function login(username, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        
        if (response.ok) {
            currentUser = result.user;
            updateAuthDisplay();
            loadCart();
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            showMessage('Đăng nhập thành công!', 'success');
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        showMessage('Có lỗi xảy ra', 'error');
    }
}

// Register function
async function register(username, email, password) {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        const result = await response.json();
        
        if (response.ok) {
            showMessage('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
            // Switch back to login form
            switchToLoginForm();
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Error registering:', error);
        showMessage('Có lỗi xảy ra', 'error');
    }
}

// Logout function
async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        currentUser = null;
        cartItems = [];
        updateAuthDisplay();
        updateCartDisplay();
        location.reload();
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Switch to login form
function switchToLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('loginMessage');
    
    if (loginForm && registerForm) {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginMessage.innerHTML = '';
    }
}

// Switch to register form
function switchToRegisterForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('loginMessage');
    
    if (loginForm && registerForm) {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginMessage.innerHTML = '';
    }
}

// Show message
function showMessage(message, type) {
    const loginMessage = document.getElementById('loginMessage');
    if (loginMessage) {
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        loginMessage.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
    }
}

// Initialize authentication
function initAuth() {
    // Add event listeners for login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            login(username, password);
        });
    }

    // Add event listeners for register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            register(username, email, password);
        });
    }

    // Add event listeners for form switching
    const switchToRegister = document.getElementById('switchToRegister');
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            switchToRegisterForm();
        });
    }

    const switchToLogin = document.getElementById('switchToLogin');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            switchToLoginForm();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (registerForm) registerForm.addEventListener('submit', handleRegister);
});

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  showAlert('Đang đăng nhập...', 'info');
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        showAlert(data.error, 'error');
      } else {
        showAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');
        setTimeout(() => window.location.href = '/Home', 1000);
      }
    })
    .catch(() => showAlert('Lỗi kết nối server', 'error'));
}

function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const confirm = document.getElementById('register-confirm').value;
  if (password !== confirm) {
    showAlert('Mật khẩu xác nhận không khớp', 'error');
    return;
  }
  showAlert('Đang đăng ký...', 'info');
  fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        showAlert(data.error, 'error');
      } else {
        showAlert('Đăng ký thành công! Đang chuyển hướng...', 'success');
        setTimeout(() => window.location.href = '/login.html', 1000);
      }
    })
    .catch(() => showAlert('Lỗi kết nối server', 'error'));
}

function showAlert(msg, type = 'info') {
  let alertBox = document.getElementById('alert-box');
  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.id = 'alert-box';
    alertBox.className = 'alert';
    document.body.prepend(alertBox);
  }
  alertBox.textContent = msg;
  alertBox.style.background = type === 'error' ? '#ffcdd2' : (type === 'success' ? '#c8e6c9' : '#ffe082');
  alertBox.style.color = type === 'error' ? '#b71c1c' : (type === 'success' ? '#256029' : '#795548');
  setTimeout(() => { alertBox.remove(); }, 2500);
} 
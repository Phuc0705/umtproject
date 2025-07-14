// Main Application Initialization

// Global variables
let currentUser = null;
let currentCar = null;
let cartItems = [];

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Luxury Car & Moto Application...');
    
    // Initialize all modules
    initAuth();
    initSearch();
    initCart();
    
    // Load initial data
    loadCars();
    
    console.log('✅ Application initialized successfully!');
});

// Initialize all functionality
function initializeApp() {
    // Check authentication status first
    checkAuthStatus().then(() => {
        // Load cart if user is logged in
        if (currentUser) {
            loadCart();
        }
        
        // Load cars
        loadCars();
    });
}

// Format price with Vietnamese locale
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Handle errors
function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    showNotification(`Có lỗi xảy ra: ${error.message}`, 'danger');
}

// Utility function to check if element exists
function elementExists(selector) {
    return document.querySelector(selector) !== null;
}

// Utility function to safely get element
function getElement(selector) {
    return document.querySelector(selector);
}

// Utility function to safely set element content
function setElementContent(selector, content) {
    const element = getElement(selector);
    if (element) {
        element.innerHTML = content;
    }
}

// Utility function to safely set element value
function setElementValue(selector, value) {
    const element = getElement(selector);
    if (element) {
        element.value = value;
    }
}

// Utility function to safely get element value
function getElementValue(selector) {
    const element = getElement(selector);
    return element ? element.value : '';
}

// Utility function to safely add event listener
function addEventListener(selector, event, handler) {
    const element = getElement(selector);
    if (element) {
        element.addEventListener(event, handler);
    }
}

// Utility function to safely remove event listener
function removeEventListener(selector, event, handler) {
    const element = getElement(selector);
    if (element) {
        element.removeEventListener(event, handler);
    }
}

// Utility function to safely show/hide element
function toggleElement(selector, show) {
    const element = getElement(selector);
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

// Utility function to safely add/remove CSS class
function toggleClass(selector, className, add) {
    const element = getElement(selector);
    if (element) {
        if (add) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    }
}

// Export functions for use in other modules
window.LuxuryCarApp = {
    currentUser,
    currentCar,
    cartItems,
    formatPrice,
    showNotification,
    handleError,
    elementExists,
    getElement,
    setElementContent,
    setElementValue,
    getElementValue,
    addEventListener,
    removeEventListener,
    toggleElement,
    toggleClass
};

fetch("/api/cars")
  .then((res) => res.json())
  .then((data) => {
    const list = document.getElementById("car-list");
    if (list) {
      data.forEach((car) => {
        const item = document.createElement("div");
        item.className = "col";
        item.innerHTML = `
          <div class="vehicle-card">
            <img src="${car.ImageUrl || "/assets/default-car.jpg"}" alt="${
          car.Name
        }" class="vehicle-img">
            <div class="vehicle-body">
              <h5 class="vehicle-title">${car.Name}</h5>
              <p class="vehicle-price">${formatPrice(car.Price)} VND</p>
              <a href="#" class="btn btn-primary" onclick="showCarDetails(${
                car.ID
              }); return false;">Chi tiết</a>
            </div>
          </div>
        `;
        list.appendChild(item);
      });
    }
  })
  .catch((err) => {
    console.error("Lỗi fetch:", err);
    showNotification(`Có lỗi xảy ra khi tải xe: ${err.message}`, "danger");
  });
const config = {
  server: "127.0.0.1",
  database: "LuxuryCarDB",
  options: {
    trustServerCertificate: true,
    trustedConnection: true,
    port: 1433
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
};

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  checkAuthStatus();
});

function renderNavbar() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  nav.innerHTML = `
    <a href="/Home">Trang chủ</a>
    <a href="/Products">Xe</a>
    <a href="/Services">Dịch vụ</a>
    <a href="/About">Giới thiệu</a>
    <a href="/Contact">Liên hệ</a>
    <span id="nav-user"></span>
    <span id="nav-admin"></span>
    <button id="logout-btn" class="btn" style="display:none; margin-left:12px;">Đăng xuất</button>
  `;
  document.getElementById('logout-btn').addEventListener('click', logout);
}

function checkAuthStatus() {
  fetch('/api/auth/status')
    .then(res => res.json())
    .then(data => {
      const navUser = document.getElementById('nav-user');
      const navAdmin = document.getElementById('nav-admin');
      const logoutBtn = document.getElementById('logout-btn');
      if (data.isLoggedIn) {
        navUser.innerHTML = `<b>Xin chào, ${data.user.username}</b>`;
        logoutBtn.style.display = 'inline-block';
        if (data.user.role === 'admin') {
          navAdmin.innerHTML = `<a href="/Orders">Quản trị</a>`;
        } else {
          navAdmin.innerHTML = `<a href="/Orders">Đơn hàng</a>`;
        }
      } else {
        navUser.innerHTML = `<a href="/login.html">Đăng nhập</a> | <a href="/register.html">Đăng ký</a>`;
        navAdmin.innerHTML = '';
        logoutBtn.style.display = 'none';
      }
    });
}

function logout() {
  fetch('/api/logout', { method: 'POST' })
    .then(() => window.location.reload());
}

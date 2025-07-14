// Cart and Order Management
let currentUser = null;
let currentCar = null;
let cartItems = [];

// Initialize cart functionality
function initCart() {
    checkAuthStatus();
    loadCart();
}

// Load cart from server
async function loadCart() {
    if (!currentUser) return;

    try {
        const response = await fetch('/api/cart');
        if (response.ok) {
            cartItems = await response.json();
            updateCartDisplay();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// Update cart display
function updateCartDisplay() {
    const cartBadge = document.getElementById('cartBadge');
    const cartItemsDiv = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartBadge || !cartItemsDiv || !cartEmpty || !cartTotal) return;

    const totalItems = cartItems.reduce((sum, item) => sum + item.Quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);

    cartBadge.textContent = totalItems;
    cartTotal.textContent = formatPrice(totalAmount) + ' VND';

    if (cartItems.length === 0) {
        cartEmpty.style.display = 'block';
        cartItemsDiv.innerHTML = '';
    } else {
        cartEmpty.style.display = 'none';
        cartItemsDiv.innerHTML = cartItems.map(item => `
            <div class="d-flex align-items-center mb-3">
                <img src="${item.ImageUrl}" alt="${item.Name}" style="width: 60px; height: 60px; object-fit: cover;" class="me-3">
                <div class="flex-grow-1">
                    <h6 class="mb-0">${item.Name}</h6>
                    <p class="mb-0 text-muted">${formatPrice(item.Price)} VND</p>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateCartItem(${item.ID}, ${item.Quantity - 1})">-</button>
                    <span class="mx-2">${item.Quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateCartItem(${item.ID}, ${item.Quantity + 1})">+</button>
                    <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeCartItem(${item.ID})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Add item to cart
async function addToCart(carId, quantity = 1) {
    if (!currentUser) {
        alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
        return;
    }

    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                carId: carId,
                quantity: quantity
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            alert('Đã thêm vào giỏ hàng!');
            loadCart();
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Có lỗi xảy ra');
    }
}

// Update cart item quantity
async function updateCartItem(carId, quantity) {
  try {
    const response = await fetch("/api/cart/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carId, quantity }),
    });
    if (response.ok) loadCart();
  } catch (error) {
    console.error("Error updating cart:", error);
    showNotification("Có lỗi xảy ra khi cập nhật giỏ hàng", "danger");
  }
}

// Remove item from cart
async function removeCartItem(itemId) {
    try {
        const response = await fetch(`/api/cart/remove/${itemId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadCart();
        }
    } catch (error) {
        console.error('Error removing cart item:', error);
    }
}

// Show checkout modal
function showCheckout() {
    if (cartItems.length === 0) {
        alert('Giỏ hàng trống');
        return;
    }

    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!checkoutItems || !checkoutTotal) return;
    
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);
    
    checkoutItems.innerHTML = cartItems.map(item => `
        <div class="d-flex justify-content-between mb-2">
            <span>${item.Name} x${item.Quantity}</span>
            <span>${formatPrice(item.Price * item.Quantity)} VND</span>
        </div>
    `).join('');
    
    checkoutTotal.textContent = formatPrice(totalAmount) + ' VND';
    
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
}

// Place order
async function placeOrder() {
    const shippingAddress = document.getElementById('shippingAddress')?.value;
    const phone = document.getElementById('phone')?.value;

    if (!shippingAddress || !phone) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: cartItems.map(item => ({
                    CarID: item.CarID,
                    Quantity: item.Quantity,
                    Price: item.Price
                })),
                totalAmount: totalAmount,
                shippingAddress: shippingAddress,
                phone: phone
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            alert('Đặt hàng thành công! Mã đơn hàng: ' + result.orderId);
            bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
            bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
            loadCart();
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Có lỗi xảy ra');
    }
}

// Format price with Vietnamese locale
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-list')) {
        loadCart();
        document.getElementById('checkout-form')?.addEventListener('submit', handleCheckout);
    }
});

function handleCheckout(e) {
    e.preventDefault();
    const shippingAddress = document.getElementById('checkout-address').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    if (!shippingAddress || !phone) {
        showAlert('Vui lòng nhập đầy đủ địa chỉ và số điện thoại', 'error');
        return;
    }
    fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress, phone })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) showAlert(data.error, 'error');
            else {
                showAlert('Đặt hàng thành công!', 'success');
                setTimeout(() => window.location.href = '/Orders', 1000);
            }
        })
        .catch(() => showAlert('Lỗi đặt hàng', 'error'));
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

// Để dùng addToCart từ HTML: window.addToCart = addToCart;
window.addToCart = addToCart;
window.removeFromCart = removeCartItem; 
// Search and Display Cars

// Load cars from API
async function loadCars() {
    try {
        const response = await fetch('/api/cars');
        const cars = await response.json();
        displayCars(cars);
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}

// Display cars in the grid
function displayCars(cars) {
    const carList = document.getElementById('car-list');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noResults = document.getElementById('noResults');

    if (!carList || !loadingSpinner || !noResults) return;

    loadingSpinner.style.display = 'none';

    if (cars.length === 0) {
        noResults.style.display = 'block';
        carList.innerHTML = '';
        return;
    }

    noResults.style.display = 'none';
    carList.innerHTML = cars.map(car => `
        <div class="col" data-aos="fade-up">
            <div class="vehicle-card">
                <img src="${car.ImageUrl}" alt="${car.Name}" class="vehicle-img">
                <div class="vehicle-body">
                    <h5 class="vehicle-title">${car.Name}</h5>
                    <p class="vehicle-price">${formatPrice(car.Price)} VND</p>
                    <ul class="vehicle-features">
                        <li class="feature-item"><i class="fas fa-bolt feature-icon"></i> ${car.Horsepower} mã lực</li>
                        <li class="feature-item"><i class="fas fa-gas-pump feature-icon"></i> ${car.Fuel}</li>
                        <li class="feature-item"><i class="fas fa-globe feature-icon"></i> ${car.Origin}</li>
                    </ul>
                    <button class="btn btn-primary" onclick="showCarDetails(${car.ID})">Chi tiết</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Search cars with filters
async function searchCars() {
  const query = document.getElementById("searchInput")?.value || "";
  const brand = document.getElementById("brandFilter")?.value || "all";
  const type = document.getElementById("typeFilter")?.value || "all";
  const priceRange = document.getElementById("priceFilter")?.value || "all";

  try {
    const response = await fetch(
      `/api/cars/search?query=${encodeURIComponent(
        query
      )}&brand=${brand}&type=${type}&priceRange=${priceRange}`
    );
    const cars = await response.json();
    displayCars(cars);
  } catch (error) {
    console.error("Error searching cars:", error);
    showNotification("Có lỗi xảy ra khi tìm kiếm xe", "danger");
  }
}

// Apply filters
function applyFilters() {
    searchCars();
}

// Clear all filters
function clearFilters() {
    const searchInput = document.getElementById('searchInput');
    const brandFilter = document.getElementById('brandFilter');
    const typeFilter = document.getElementById('typeFilter');
    const priceFilter = document.getElementById('priceFilter');

    if (searchInput) searchInput.value = '';
    if (brandFilter) brandFilter.value = 'all';
    if (typeFilter) typeFilter.value = 'all';
    if (priceFilter) priceFilter.value = 'all';

    loadCars();
}

// Show car details modal
async function showCarDetails(carId) {
    try {
        const response = await fetch(`/api/cars/${carId}`);
        const car = await response.json();
        
        currentCar = car;
        
        const modalTitle = document.getElementById('modalVehicleTitle');
        const modalName = document.getElementById('modalVehicleName');
        const modalPrice = document.getElementById('modalVehiclePrice');
        const modalHorsepower = document.getElementById('modalVehicleHorsepower');
        const modalFuel = document.getElementById('modalVehicleFuel');
        const modalOrigin = document.getElementById('modalVehicleOrigin');
        const modalType = document.getElementById('modalVehicleType');
        const modalDescription = document.getElementById('modalVehicleDescription');
        const modalImage = document.getElementById('modalVehicleImage');
        
        if (modalTitle) modalTitle.textContent = car.Name;
        if (modalName) modalName.textContent = car.Name;
        if (modalPrice) modalPrice.textContent = formatPrice(car.Price) + ' VND';
        if (modalHorsepower) modalHorsepower.textContent = car.Horsepower;
        if (modalFuel) modalFuel.textContent = car.Fuel;
        if (modalOrigin) modalOrigin.textContent = car.Origin;
        if (modalType) modalType.textContent = car.Type;
        if (modalDescription) modalDescription.textContent = car.Description;
        if (modalImage) {
            modalImage.src = car.ImageUrl;
            modalImage.alt = car.Name;
        }
        
        new bootstrap.Modal(document.getElementById('vehicleModal')).show();
    } catch (error) {
        console.error('Error loading car details:', error);
    }
}

// Initialize search functionality
function initSearch() {
    // Add event listener for search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchCars();
            }
        });
    }

    // Add event listeners for filter changes
    const brandFilter = document.getElementById('brandFilter');
    const typeFilter = document.getElementById('typeFilter');
    const priceFilter = document.getElementById('priceFilter');

    if (brandFilter) {
        brandFilter.addEventListener('change', searchCars);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', searchCars);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', searchCars);
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  if (searchForm) searchForm.addEventListener('submit', handleSearch);
});

function handleSearch(e) {
  e.preventDefault();
  const query = document.getElementById('search-query')?.value.trim() || '';
  const brand = document.getElementById('search-brand')?.value || 'all';
  const type = document.getElementById('search-type')?.value || 'all';
  const priceRange = document.getElementById('search-price')?.value || 'all';
  fetch(`/api/cars/search?query=${encodeURIComponent(query)}&brand=${brand}&type=${type}&priceRange=${priceRange}`)
    .then(res => res.json())
    .then(data => renderSearchResults(data))
    .catch(() => showAlert('Lỗi tìm kiếm xe', 'error'));
}

function renderSearchResults(cars) {
  const resultBox = document.getElementById('search-results');
  if (!resultBox) return;
  if (!cars.length) {
    resultBox.innerHTML = '<div class="alert">Không tìm thấy xe phù hợp</div>';
    return;
  }
  resultBox.innerHTML = '<div class="grid">' + cars.map(car => `
    <div class="card">
      <img src="/assets/${car.ImageUrl}" alt="${car.Name}" class="car-img">
      <h3>${car.Name}</h3>
      <div>Hãng: ${car.Brand}</div>
      <div>Loại: ${car.Type}</div>
      <div>Giá: <b>${car.Price.toLocaleString()} đ</b></div>
      <button class="btn" onclick="addToCart(${car.ID})">Thêm vào giỏ</button>
    </div>
  `).join('') + '</div>';
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
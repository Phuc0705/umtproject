<div
  class="modal fade"
  id="vehicleModal"
  tabindex="-1"
  aria-labelledby="vehicleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalVehicleTitle"></h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <p>
          Giá: <span id="modalVehiclePrice"></span>
        </p>
        <p>
          Mã lực: <span id="modalVehicleHorsepower"></span>
        </p>
        <p>
          Nhiên liệu: <span id="modalVehicleFuel"></span>
        </p>
        <p>
          Xuất xứ: <span id="modalVehicleOrigin"></span>
        </p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          Đóng
        </button>
      </div>
    </div>
  </div>
</div>;

// scripts.js - Hiệu ứng phụ trợ cơ bản

document.addEventListener('DOMContentLoaded', () => {
  // Nút cuộn lên đầu trang
  const scrollBtn = document.createElement('button');
  scrollBtn.textContent = '↑';
  scrollBtn.className = 'btn';
  scrollBtn.style.position = 'fixed';
  scrollBtn.style.bottom = '24px';
  scrollBtn.style.right = '24px';
  scrollBtn.style.display = 'none';
  scrollBtn.style.zIndex = 1000;
  document.body.appendChild(scrollBtn);
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
  });

  // Đóng alert khi click
  document.body.addEventListener('click', e => {
    if (e.target.classList.contains('alert')) e.target.remove();
  });

  // Chuyển tab đơn giản (nếu có)
  const tabLinks = document.querySelectorAll('.tab-link');
  tabLinks.forEach(link => {
    link.addEventListener('click', function() {
      const tabId = this.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
      document.getElementById(tabId).style.display = 'block';
      tabLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// Bạn có thể thêm các hiệu ứng nhỏ khác ở đây nếu muốn!

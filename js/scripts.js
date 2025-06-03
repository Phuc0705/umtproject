// Hiển thị chi tiết xe
function showDetails(carId) {
  document.getElementById("car-list").classList.add("hidden");
  document.getElementById("car-detail").classList.remove("hidden");

  let content = "";
  if (carId === "ferrari") {
    content = `
      <h2>Ferrari SF90</h2>
      <img src="assets/img/ferrari.jpg" style="width:100%; max-width:600px; border-radius: 10px;">
      <ul>
        <li>Động cơ Hybrid V8</li>
        <li>Tốc độ tối đa: 340km/h</li>
        <li>AWD, 986 mã lực</li>
        <li>Giá: $500,000</li>
      </ul>
    `;
  } else if (carId === "ducati") {
    content = `
      <h2>Ducati Panigale V4</h2>
      <img src="assets/img/ducati.jpg" style="width:100%; max-width:600px; border-radius: 10px;">
      <ul>
        <li>Dung tích 1103cc</li>
        <li>Tốc độ tối đa: 300km/h</li>
        <li>Phanh Brembo, siêu nhẹ</li>
        <li>Giá: $35,000</li>
      </ul>
    `;
  } else if (carId === "lamborghini") {
    content = `
      <h2>Lamborghini Aventador</h2>
      <img src="assets/img/lamborghini.jpg" style="width:100%; max-width:600px; border-radius: 10px;">
      <ul>
        <li>Động cơ V12</li>
        <li>Tốc độ tối đa: 350km/h</li>
        <li>Hệ dẫn động 4 bánh</li>
        <li>Giá: $600,000</li>
      </ul>
    `;
  } else if (carId === "bmw") {
    content = `
      <h2>BMW S1000RR</h2>
      <img src="assets/img/bmw.jpg" style="width:100%; max-width:600px; border-radius: 10px;">
      <ul>
        <li>Dung tích 999cc</li>
        <li>Tốc độ tối đa: 299km/h</li>
        <li>Công nghệ ShiftCam</li>
        <li>Giá: $30,000</li>
      </ul>
    `;
  }

  document.getElementById("car-info").innerHTML = content;
}

// Quay lại danh sách
function backToList() {
  document.getElementById("car-detail").classList.add("hidden");
  document.getElementById("car-list").classList.remove("hidden");
}

// Lọc loại xe
function filterVehicles(type) {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    if (type === "all" || card.dataset.type === type) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Chatbot mô phỏng
const input = document.getElementById("chat-input");
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && input.value.trim()) {
    const msg = input.value.trim();
    const log = document.getElementById("chat-log");
    log.innerHTML += `<div class="chat-msg user-msg"><strong>Bạn:</strong> ${msg}</div>`;
    setTimeout(() => {
      log.innerHTML += `<div class="chat-msg bot-msg"><strong>AI:</strong> Cảm ơn bạn! Chúng tôi sẽ hỗ trợ sớm nhất.</div>`;
      log.scrollTop = log.scrollHeight;
    }, 500);
    input.value = "";
  }
});

// Gửi form liên hệ (mô phỏng)
document
  .getElementById("contact-form")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi qua email.");
    this.reset();
  });

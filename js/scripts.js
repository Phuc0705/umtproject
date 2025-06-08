// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
});

// Back to Top Button
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.classList.add("active");
  } else {
    backToTop.classList.remove("active");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Chatbot Functionality
const chatbotContainer = document.getElementById("chatbotContainer");
const chatbotToggle = document.getElementById("chatbotToggle");
const closeChatbot = document.getElementById("closeChatbot");
const chatbotForm = document.getElementById("chatbotForm");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotMessages = document.getElementById("chatbotMessages");

chatbotToggle.addEventListener("click", () => {
  chatbotContainer.style.display =
    chatbotContainer.style.display === "none" ? "block" : "none";
});

closeChatbot.addEventListener("click", () => {
  chatbotContainer.style.display = "none";
});

chatbotForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userMessage = chatbotInput.value.trim();
  if (userMessage) {
    const userMsgElement = document.createElement("div");
    userMsgElement.className = "message user-message";
    userMsgElement.textContent = userMessage;
    chatbotMessages.appendChild(userMsgElement);

    // Simple bot response
    const botMsgElement = document.createElement("div");
    botMsgElement.className = "message bot-message";
    botMsgElement.textContent =
      "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.";
    chatbotMessages.appendChild(botMsgElement);

    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    chatbotInput.value = "";
  }
});

// Vehicle Details Function
function showDetails(vehicle) {
  let title, price, horsepower, fuel, origin;

  switch (vehicle) {
    case "ferrari":
      title = "Ferrari SF90 Stradale";
      price = "2.5 tỷ VND";
      horsepower = "1000 mã lực";
      fuel = "Xăng";
      origin = "Nhập khẩu";
      break;
    case "lamborghini":
      title = "Lamborghini Aventador";
      price = "12.8 tỷ VND";
      horsepower = "770 mã lực";
      fuel = "Xăng";
      origin = "Nhập khẩu";
      break;
    case "porsche":
      title = "Porsche 911 Turbo S";
      price = "6.5 tỷ VND";
      horsepower = "650 mã lực";
      fuel = "Xăng";
      origin = "Nhập khẩu";
      break;
    case "bentley":
      title = "Bentley Continental GT";
      price = "8.9 tỷ VND";
      horsepower = "626 mã lực";
      fuel = "Xăng";
      origin = "Nhập khẩu";
      break;
    case "ducati":
      title = "Ducati Panigale V4";
      price = "1.2 tỷ VND";
      horsepower = "214 mã lực";
      fuel = "Xăng";
      origin = "Nhập khẩu";
      break;
    case "bmw":
      title = "BMW M8 Competition";
      price = "5.8 tỷ VND";
      horsepower = "625 mã lực";
      fuel = "Xăng";
      origin = "Nhập khẩu";
      break;
    default:
      return;
  }

  document.getElementById("modalVehicleTitle").textContent = title;
  document.getElementById("modalVehiclePrice").textContent = price;
  document.getElementById("modalVehicleHorsepower").textContent = horsepower;
  document.getElementById("modalVehicleFuel").textContent = fuel;
  document.getElementById("modalVehicleOrigin").textContent = origin;

  const modal = new bootstrap.Modal(document.getElementById("vehicleModal"));
  modal.show();
}

// Form Submission Handlers
document.getElementById("testDriveForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Đăng ký lái thử thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
  e.target.reset();
});

document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Tin nhắn của bạn đã được gửi! Chúng tôi sẽ phản hồi sớm.");
  e.target.reset();
});

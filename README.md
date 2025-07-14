# 🚗 Luxury Car & Moto - Hệ Thống Bán Xe Cao Cấp

## 📋 Mô tả dự án

Hệ thống website bán xe hơi và xe máy cao cấp với đầy đủ tính năng thương mại điện tử, được xây dựng bằng Node.js, Express, SQL Server và JavaScript.

## ✨ Tính năng chính

### 🔍 Tìm kiếm và Bộ lọc
- **Tìm kiếm thông minh**: Tìm kiếm theo tên xe, hãng xe, mô tả
- **Bộ lọc đa tiêu chí**: 
  - Theo hãng xe (Ferrari, Lamborghini, Porsche, Bentley, BMW, Mercedes-Benz, Aston Martin, McLaren, Rolls-Royce, Ducati)
  - Theo loại xe (Supercar, Sports Car, Luxury, Ultra Luxury, Motorcycle)
  - Theo khoảng giá (Dưới 1 tỷ, 1-3 tỷ, 3-5 tỷ, Trên 5 tỷ)

### 👤 Hệ thống người dùng
- **Đăng ký tài khoản**: Tạo tài khoản mới với email và mật khẩu
- **Đăng nhập/Đăng xuất**: Xác thực người dùng với session
- **Bảo mật**: Mật khẩu được mã hóa bằng bcrypt

### 🛒 Giỏ hàng và Đặt hàng
- **Thêm vào giỏ hàng**: Thêm xe vào giỏ hàng với số lượng
- **Quản lý giỏ hàng**: Tăng/giảm số lượng, xóa sản phẩm
- **Thanh toán**: Form đặt hàng với thông tin giao hàng
- **Lưu trữ**: Dữ liệu giỏ hàng được lưu trong database

### 📦 Quản lý đơn hàng
- **Lịch sử đơn hàng**: Xem tất cả đơn hàng đã đặt
- **Chi tiết đơn hàng**: Xem thông tin chi tiết từng đơn hàng
- **Trạng thái đơn hàng**: Theo dõi trạng thái (Pending, Processing, Shipped, Delivered, Cancelled)

### 🚗 Hiển thị xe
- **Danh sách xe**: Hiển thị tất cả xe với thông tin chi tiết
- **Chi tiết xe**: Modal hiển thị đầy đủ thông tin kỹ thuật
- **Hình ảnh**: Hiển thị hình ảnh xe chất lượng cao

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **SQL Server**: Database
- **bcrypt**: Mã hóa mật khẩu
- **express-session**: Quản lý session

### Frontend
- **HTML5**: Cấu trúc trang web
- **CSS3**: Styling với Bootstrap 5
- **JavaScript**: Tương tác người dùng
- **Font Awesome**: Icons
- **AOS**: Animations

## 📁 Cấu trúc dự án

```
UMTproject_final/
├── backend/
│   ├── server.js          # Server chính
│   ├── package.json       # Dependencies
│   └── node_modules/      # Packages
├── Views/
│   ├── Home/
│   │   └── home.html      # Trang chủ
│   ├── Products/
│   │   └── vehicles.html  # Trang sản phẩm
│   ├── Services/
│   │   └── services.html  # Trang dịch vụ
│   ├── About/
│   │   └── about.html     # Trang giới thiệu
│   ├── Contact/
│   │   └── contact.html   # Trang liên hệ
│   └── Orders/
│       └── orders.html    # Trang đơn hàng
├── wwwroot/
│   ├── assets/
│   │   └── assets/        # Hình ảnh xe
│   ├── css/
│   │   └── css/
│   │       └── styles.css # CSS chính
│   └── js/
│       └── js/
│           ├── app.js     # App chính
│           ├── auth.js    # Xử lý đăng nhập
│           ├── cart.js    # Xử lý giỏ hàng
│           ├── search.js  # Xử lý tìm kiếm
│           └── scripts.js # Scripts khác
├── Data/
│   └── users.txt          # Dữ liệu người dùng (cũ)
├── database_setup.sql     # Script tạo database
└── README.md              # Hướng dẫn này
```

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 2. Thiết lập database
1. Mở SQL Server Management Studio
2. Kết nối đến server `VOSTRO-14-3000\SQLEXPRESS`
3. Chạy script `database_setup.sql` để tạo database và bảng

### 3. Khởi động server
```bash
cd backend
node server.js
```

### 4. Truy cập website
Mở trình duyệt và vào: `http://localhost:3000`

## 📊 Cấu trúc Database

### Bảng Users
- `ID`: Khóa chính
- `Username`: Tên đăng nhập (unique)
- `Email`: Email (unique)
- `Password`: Mật khẩu đã mã hóa
- `CreatedAt`: Ngày tạo
- `UpdatedAt`: Ngày cập nhật

### Bảng Cars
- `ID`: Khóa chính
- `Name`: Tên xe
- `Brand`: Hãng xe
- `Type`: Loại xe
- `Price`: Giá
- `Horsepower`: Mã lực
- `Fuel`: Loại nhiên liệu
- `Origin`: Xuất xứ
- `Description`: Mô tả
- `ImageUrl`: Đường dẫn hình ảnh
- `Stock`: Số lượng tồn kho

### Bảng CartItems
- `ID`: Khóa chính
- `UserID`: ID người dùng (FK)
- `CarID`: ID xe (FK)
- `Quantity`: Số lượng
- `CreatedAt`: Ngày tạo
- `UpdatedAt`: Ngày cập nhật

### Bảng Orders
- `ID`: Khóa chính
- `UserID`: ID người dùng (FK)
- `TotalAmount`: Tổng tiền
- `ShippingAddress`: Địa chỉ giao hàng
- `Phone`: Số điện thoại
- `Status`: Trạng thái đơn hàng
- `CreatedAt`: Ngày tạo
- `UpdatedAt`: Ngày cập nhật

### Bảng OrderItems
- `ID`: Khóa chính
- `OrderID`: ID đơn hàng (FK)
- `CarID`: ID xe (FK)
- `Quantity`: Số lượng
- `Price`: Đơn giá
- `CreatedAt`: Ngày tạo

## 🔧 API Endpoints

### Xe
- `GET /api/cars` - Lấy tất cả xe
- `GET /api/cars/search` - Tìm kiếm xe
- `GET /api/cars/:id` - Lấy chi tiết xe

### Người dùng
- `POST /api/register` - Đăng ký
- `POST /api/login` - Đăng nhập
- `POST /api/logout` - Đăng xuất
- `GET /api/auth/status` - Kiểm tra trạng thái đăng nhập

### Giỏ hàng
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/add` - Thêm vào giỏ hàng
- `PUT /api/cart/update` - Cập nhật giỏ hàng
- `DELETE /api/cart/remove/:id` - Xóa khỏi giỏ hàng

### Đơn hàng
- `GET /api/orders` - Lấy lịch sử đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới

## 🎯 Hướng dẫn sử dụng

### 1. Đăng ký tài khoản
1. Click "Đăng nhập" trên menu
2. Click "Đăng ký ngay"
3. Điền thông tin: tên đăng nhập, email, mật khẩu
4. Click "Đăng ký"

### 2. Tìm kiếm xe
1. Vào trang "Xe đang bán"
2. Sử dụng ô tìm kiếm hoặc bộ lọc bên trái
3. Chọn hãng xe, loại xe, khoảng giá
4. Click "Áp dụng bộ lọc"

### 3. Thêm vào giỏ hàng
1. Click "Chi tiết" trên xe muốn mua
2. Xem thông tin chi tiết trong modal
3. Click "Thêm vào giỏ hàng"

### 4. Đặt hàng
1. Click icon giỏ hàng trên menu
2. Kiểm tra sản phẩm trong giỏ hàng
3. Click "Thanh toán"
4. Điền thông tin giao hàng
5. Click "Đặt hàng"

### 5. Xem lịch sử đơn hàng
1. Click "Đơn hàng" trên menu
2. Xem danh sách đơn hàng
3. Click "Xem chi tiết" để xem thông tin đầy đủ

## 🔒 Bảo mật

- Mật khẩu được mã hóa bằng bcrypt
- Session được quản lý an toàn
- SQL injection được ngăn chặn
- CORS được cấu hình đúng cách

## 🚀 Tính năng nâng cao

- **Responsive Design**: Tương thích mobile/desktop
- **Animations**: Hiệu ứng mượt mà với AOS
- **Real-time Updates**: Cập nhật giỏ hàng real-time
- **Error Handling**: Xử lý lỗi toàn diện
- **Loading States**: Hiển thị trạng thái loading

## 📞 Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ:
- Email: contact@luxurycar.vn
- Phone: 077******5
- Address: 60, Quận 2, TP.HCM

---

**© 2025 Luxury Car & Moto. All rights reserved.** 
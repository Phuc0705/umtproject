const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "luxury-car-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Phục vụ tài nguyên tĩnh từ wwwroot
app.use(express.static(path.join(__dirname, "..", "wwwroot")));

const config = {
  server: process.env.DB_SERVER || "VOSTRO-14-3000\\SQLEXPRESS",
  database: process.env.DB_NAME || "LuxuryCarDB",
  user: process.env.DB_USER || "umtuser",
  password: process.env.DB_PASSWORD || "umt12345",
  options: { trustServerCertificate: true },
  pool: { max: 20, min: 5, idleTimeoutMillis: 60000 },
};

let poolPromise = null;
async function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
}

// Middleware kiểm tra quyền admin
function requireAdmin(req, res, next) {
  if (!req.session.role || req.session.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Chỉ admin mới được phép thực hiện chức năng này!" });
  }
  next();
}

// API: Lấy tất cả xe
app.get("/api/cars", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT * FROM Cars ORDER BY Name");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi kết nối CSDL", details: err.message });
  }
});

// API: Tìm kiếm xe
app.get("/api/cars/search", async (req, res) => {
  try {
    const { query, brand, priceRange, type } = req.query;
    const pool = await getPool();
    const request = pool.request();
    let sqlQuery = "SELECT * FROM Cars WHERE 1=1";
    if (query) request.input("query", sql.NVarChar, `%${query}%`);
    if (brand && brand !== "all") request.input("brand", sql.NVarChar, brand);
    if (type && type !== "all") request.input("type", sql.NVarChar, type);

    if (query)
      sqlQuery +=
        " AND (Name LIKE @query OR Brand LIKE @query OR Description LIKE @query)";
    if (brand && brand !== "all") sqlQuery += " AND Brand = @brand";
    if (type && type !== "all") sqlQuery += " AND Type = @type";
    if (priceRange && priceRange !== "all") {
      switch (priceRange) {
        case "under1b":
          sqlQuery += " AND Price < 1000000000";
          break;
        case "1b-3b":
          sqlQuery += " AND Price BETWEEN 1000000000 AND 3000000000";
          break;
        case "3b-5b":
          sqlQuery += " AND Price BETWEEN 3000000000 AND 5000000000";
          break;
        case "over5b":
          sqlQuery += " AND Price > 5000000000";
          break;
      }
    }
    const result = await request.query(sqlQuery);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi tìm kiếm", details: err.message });
  }
});

// API: Lấy chi tiết xe theo ID
app.get("/api/cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Cars WHERE ID = @id");
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Không tìm thấy xe" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Lỗi lấy thông tin xe", details: err.message });
  }
});

// Đăng ký người dùng
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const pool = await getPool();
    const check = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .input("email", sql.NVarChar, email)
      .query(
        "SELECT * FROM Users WHERE Username = @username OR Email = @email"
      );
    if (check.recordset.length > 0) {
      return res
        .status(400)
        .json({ error: "Tên đăng nhập hoặc email đã tồn tại" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool
      .request()
      .input("username", sql.NVarChar, username)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword)
      .query(
        "INSERT INTO Users (Username, Email, PasswordHash, Role) VALUES (@username, @email, @password, 'user')"
      );
    res.json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi đăng ký", details: err.message });
  }
});

// Đăng nhập
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const pool = await getPool();
    const userRes = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .query("SELECT * FROM Users WHERE Username = @username");
    if (userRes.recordset.length === 0) {
      return res
        .status(401)
        .json({ error: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }
    const user = userRes.recordset[0];
    const isValidPassword = await bcrypt.compare(password, user.PasswordHash);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ error: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }
    req.session.userId = user.ID;
    req.session.username = user.Username;
    req.session.role = user.Role;
    res.json({
      message: "Đăng nhập thành công",
      username: user.Username,
      role: user.Role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi đăng nhập", details: err.message });
  }
});

// API: Đăng xuất
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "Lỗi đăng xuất", details: err.message });
    } else {
      res.json({ message: "Đăng xuất thành công" });
    }
  });
});

// API: Kiểm tra trạng thái đăng nhập
app.get("/api/auth/status", (req, res) => {
  if (req.session.userId) {
    res.json({
      isLoggedIn: true,
      user: {
        id: req.session.userId,
        username: req.session.username,
        role: req.session.role,
      },
    });
  } else {
    res.json({ isLoggedIn: false });
  }
});

// API: Thêm xe vào giỏ hàng
app.post("/api/cart/add", async (req, res) => {
  try {
    const { carId, quantity } = req.body;
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Vui lòng đăng nhập" });
    const pool = await getPool();
    const check = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("carId", sql.Int, carId)
      .query(
        "SELECT * FROM CartItems WHERE UserID = @userId AND CarID = @carId"
      );
    if (check.recordset.length > 0) {
      await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("carId", sql.Int, carId)
        .input("quantity", sql.Int, quantity)
        .query(
          "UPDATE CartItems SET Quantity = Quantity + @quantity WHERE UserID = @userId AND CarID = @carId"
        );
    } else {
      await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("carId", sql.Int, carId)
        .input("quantity", sql.Int, quantity)
        .query(
          "INSERT INTO CartItems (UserID, CarID, Quantity) VALUES (@userId, @carId, @quantity)"
        );
    }
    res.json({ message: "Đã thêm vào giỏ hàng" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Lỗi thêm vào giỏ hàng", details: err.message });
  }
});

// API: Lấy giỏ hàng của user
app.get("/api/cart", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Vui lòng đăng nhập" });
    const pool = await getPool();
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query(
        "SELECT CartItems.ID, CartItems.Quantity, Cars.* FROM CartItems JOIN Cars ON CartItems.CarID = Cars.ID WHERE CartItems.UserID = @userId"
      );
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi lấy giỏ hàng", details: err.message });
  }
});

// API: Xóa xe khỏi giỏ hàng
app.delete("/api/cart/remove", async (req, res) => {
  try {
    const { carId } = req.body;
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Vui lòng đăng nhập" });
    const pool = await getPool();
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("carId", sql.Int, carId)
      .query("DELETE FROM CartItems WHERE UserID = @userId AND CarID = @carId");
    res.json({ message: "Đã xóa khỏi giỏ hàng" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Lỗi xóa khỏi giỏ hàng", details: err.message });
  }
});

// API: Cập nhật số lượng trong giỏ hàng
app.put("/api/cart/update", async (req, res) => {
  try {
    const { carId, quantity } = req.body;
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Vui lòng đăng nhập" });
    const pool = await getPool();
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("carId", sql.Int, carId)
      .input("quantity", sql.Int, quantity)
      .query(
        "UPDATE CartItems SET Quantity = @quantity WHERE UserID = @userId AND CarID = @carId"
      );
    res.json({ message: "Đã cập nhật số lượng" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Lỗi cập nhật giỏ hàng", details: err.message });
  }
});

// API: Tạo đơn hàng
app.post("/api/orders", async (req, res) => {
  try {
    const { shippingAddress, phone } = req.body;
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Vui lòng đăng nhập" });
    const pool = await getPool();
    const cartResult = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query("SELECT * FROM CartItems WHERE UserID = @userId");
    const cartItems = cartResult.recordset;
    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Giỏ hàng trống!" });
    }
    // Tính tổng tiền với JOIN
    const priceResult = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query(
        "SELECT SUM(Cars.Price * CartItems.Quantity) as Total FROM CartItems JOIN Cars ON CartItems.CarID = Cars.ID WHERE CartItems.UserID = @userId"
      );
    const totalAmount = priceResult.recordset[0].Total || 0;
    const orderResult = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("totalAmount", sql.Decimal(15, 2), totalAmount)
      .input("shippingAddress", sql.NVarChar, shippingAddress)
      .input("phone", sql.NVarChar, phone)
      .query(
        "INSERT INTO Orders (UserID, TotalAmount, ShippingAddress, Phone, Status, CreatedAt) OUTPUT INSERTED.ID VALUES (@userId, @totalAmount, @shippingAddress, @phone, 'Pending', GETDATE())"
      );
    const orderId = orderResult.recordset[0].ID;
    for (const item of cartItems) {
      await pool
        .request()
        .input("orderId", sql.Int, orderId)
        .input("carId", sql.Int, item.CarID)
        .input("quantity", sql.Int, item.Quantity)
        .input(
          "price",
          sql.Decimal(15, 2),
          (
            await pool
              .request()
              .input("carId", sql.Int, item.CarID)
              .query("SELECT Price FROM Cars WHERE ID = @carId")
          ).recordset[0].Price
        )
        .query(
          "INSERT INTO OrderItems (OrderID, CarID, Quantity, Price, CreatedAt) VALUES (@orderId, @carId, @quantity, @price, GETDATE())"
        );
    }
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .query("DELETE FROM CartItems WHERE UserID = @userId");
    res.json({ message: "Đặt hàng thành công!", orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi đặt hàng", details: err.message });
  }
});

// API: Lấy lịch sử đơn hàng
app.get("/api/orders", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Vui lòng đăng nhập" });
    const pool = await getPool();
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query(
        "SELECT o.*, oi.CarID, oi.Quantity, oi.Price, c.Name, c.ImageUrl FROM Orders o JOIN OrderItems oi ON o.ID = oi.OrderID JOIN Cars c ON oi.CarID = c.ID WHERE o.UserID = @userId ORDER BY o.CreatedAt DESC"
      );
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Lỗi lấy lịch sử đơn hàng", details: err.message });
  }
});

// API: Thêm người dùng (chỉ admin)
app.post("/api/users", requireAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const pool = await getPool();
    const check = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .input("email", sql.NVarChar, email)
      .query(
        "SELECT * FROM Users WHERE Username = @username OR Email = @email"
      );
    if (check.recordset.length > 0) {
      return res
        .status(400)
        .json({ error: "Tên đăng nhập hoặc email đã tồn tại" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool
      .request()
      .input("username", sql.NVarChar, username)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword)
      .input("role", sql.NVarChar, role || "user")
      .query(
        "INSERT INTO Users (Username, Email, PasswordHash, Role) VALUES (@username, @email, @password, @role)"
      );
    res.json({ message: "Đã thêm người dùng thành công" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Lỗi thêm người dùng", details: err.message });
  }
});

// API: Xóa người dùng (chỉ admin)
app.delete("/api/users/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Users WHERE ID = @id");
    res.json({ message: "Đã xóa người dùng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi xóa người dùng", details: err.message });
  }
});

// API: Thêm đăng ký lái thử
app.post("/api/testdrives", async (req, res) => {
  try {
    const { fullName, phone, email, carId, appointmentDate } = req.body;
    const userId = req.session.userId;
    const pool = await getPool();
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("fullName", sql.NVarChar, fullName)
      .input("phone", sql.NVarChar, phone)
      .input("email", sql.NVarChar, email)
      .input("carId", sql.Int, carId)
      .input("appointmentDate", sql.Date, appointmentDate)
      .query(
        "INSERT INTO TestDrives (UserID, FullName, Phone, Email, CarID, AppointmentDate, CreatedAt) VALUES (@userId, @fullName, @phone, @email, @carId, @appointmentDate, GETDATE())"
      );
    res.json({ message: "Đăng ký lái thử thành công" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Lỗi đăng ký lái thử", details: err.message });
  }
});

// API: Thêm liên hệ
app.post("/api/contacts", async (req, res) => {
  try {
    const { fullName, phone, email, message } = req.body;
    const pool = await getPool();
    await pool
      .request()
      .input("fullName", sql.NVarChar, fullName)
      .input("phone", sql.NVarChar, phone)
      .input("email", sql.NVarChar, email)
      .input("message", sql.NVarChar, message)
      .query(
        "INSERT INTO Contacts (FullName, Phone, Email, Message, CreatedAt) VALUES (@fullName, @phone, @email, @message, GETDATE())"
      );
    res.json({ message: "Gửi liên hệ thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi gửi liên hệ", details: err.message });
  }
});

// Route mặc định
app.get("/", (req, res) => res.redirect("/vehicles.html"));

app.listen(3000, () => console.log("🚀 Server chạy tại http://localhost:3000"));

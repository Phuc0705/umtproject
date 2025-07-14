-- Tạo database nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'LuxuryCarDB')
BEGIN
    CREATE DATABASE LuxuryCarDB;
END
GO

USE LuxuryCarDB;
GO

-- Xóa các bảng nếu đã tồn tại (đảm bảo thứ tự khóa ngoại)
IF OBJECT_ID('OrderItems', 'U') IS NOT NULL DROP TABLE OrderItems;
IF OBJECT_ID('Orders', 'U') IS NOT NULL DROP TABLE Orders;
IF OBJECT_ID('CartItems', 'U') IS NOT NULL DROP TABLE CartItems;
IF OBJECT_ID('Cars', 'U') IS NOT NULL DROP TABLE Cars;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
GO

-- Bảng Users
CREATE TABLE Users (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'user',
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Thêm tài khoản admin mặc định (password: admin123, hash sẽ cập nhật khi đăng ký/login)
INSERT INTO Users (Username, Email, PasswordHash, Role)
VALUES ('admin', 'admin@example.com', 'admin123', 'admin');
GO

-- Bảng Cars
CREATE TABLE Cars (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Brand NVARCHAR(50),
    Type NVARCHAR(50),
    Price BIGINT,
    Horsepower INT,
    Fuel NVARCHAR(20),
    Origin NVARCHAR(50),
    Description NVARCHAR(500),
    ImageUrl NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME
);
GO

-- Dữ liệu mẫu cho Cars
DELETE FROM Cars;

INSERT INTO Cars (Name, Brand, Type, Price, Horsepower, Fuel, Origin, Description, ImageUrl)
VALUES
('Ferrari SF90 Stradale', 'Ferrari', 'Supercar', 25000000000, 1000, 'Xăng', 'Ý', N'Siêu xe hybrid mạnh mẽ nhất của Ferrari', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\1.jpg'),
('Lamborghini Aventador', 'Lamborghini', 'Supercar', 32000000000, 770, 'Xăng', 'Ý', N'Siêu xe V12 huyền thoại', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\2.jpg'),
('Porsche 911 Turbo S', 'Porsche', 'Sports Car', 21000000000, 650, 'Xăng', 'Đức', N'Thể thao đỉnh cao của Porsche', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\3.jpg'),
('Bentley Continental GT', 'Bentley', 'Luxury', 22000000000, 626, 'Xăng', 'Anh', N'Xe sang trọng bậc nhất', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\4.jpg'),
('Ducati Panigale V4', 'Ducati', 'Sport Bike', 2140000000, 214, 'Xăng', 'Ý', N'Xe đua với công nghệ tiên tiến', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\5.jpg'),
('BMW i8', 'BMW', 'Hybrid', 15000000000, 369, 'Hybrid', 'Đức', N'Xe thể thao hybrid', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\6.jpg'),

('Porsche Taycan', 'Porsche', 'Electric', 4800000000, 761, 'Điện', 'Đức', N'Xe điện hiệu suất cao', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\7.jpg'),
('Ferrari California T', 'Ferrari', 'Convertible', 7700000000, 560, 'Xăng', 'Ý', N'Xe mui trần thể thao phong cách', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\8.webp'),
('Mercedes S 450', 'Mercedes-Benz', 'Luxury', 6500000000, 367, 'Xăng', 'Đức', N'Xe sang trọng với công nghệ tiên tiến', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\9.jpg'),
('BMW 430i 2023', 'BMW', 'Coupe', 2799000000, 255, 'Xăng', 'Đức', N'Mẫu coupe thể thao hiện đại', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\10.jpg'),
('Kawasaki Ninja H2R', 'Kawasaki', 'Sport Bike', 1270000000, 310, 'Xăng', 'Nhật Bản', N'Xe máy đua siêu nhanh', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\11.jpg'),
('MOTO F4 LH44', 'MV Agusta', 'Sport Bike', 1380000000, 212, 'Xăng', 'Ý', N'Xe máy thể thao cao cấp', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\12.jpg'),

('Moto BMW HP4', 'BMW', 'Sport Bike', 1800000000, 215, 'Xăng', 'Đức', N'Xe máy thể thao đỉnh cao', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\13.jpg'),
('Moto Arch Method 143', 'Arch Motorcycle', 'Cruiser', 1870000000, 122, 'Xăng', 'Mỹ', N'Xe cruiser phong cách độc đáo', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\14.jpg'),
('MV Agusta F4 Claudio', 'MV Agusta', 'Sport Bike', 1900000000, 205, 'Xăng', 'Ý', N'Phiên bản giới hạn sang trọng', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\15.jpg'),
('Aprilia RSV4 FW-GP', 'Aprilia', 'Sport Bike', 1900000000, 217, 'Xăng', 'Ý', N'Xe đua với hiệu suất vượt trội', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\16.jpg'),
('PGM 2.0 Liter V8', 'PGM', 'Sport Bike', 2100000000, 200, 'Xăng', 'Nhật Bản', N'Xe máy với động cơ V8 độc đáo', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\17.jpg'),
('MTT 420RR', 'MTT', 'Sport Bike', 6500000000, 420, 'Xăng', 'Mỹ', N'Xe máy mạnh nhất thế giới', 'C:\Users\DELL\UMTproject_final\wwwroot\assets\assets\18.jpg');

GO

-- Bảng Orders
CREATE TABLE Orders (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    TotalAmount BIGINT NOT NULL,
    ShippingAddress NVARCHAR(255),
    Phone NVARCHAR(20),
    Status NVARCHAR(20) DEFAULT 'Pending',
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);
GO

-- Bảng OrderItems
CREATE TABLE OrderItems (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    CarID INT NOT NULL,
    Quantity INT NOT NULL,
    Price BIGINT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (OrderID) REFERENCES Orders(ID),
    FOREIGN KEY (CarID) REFERENCES Cars(ID)
);
GO

-- Bảng CartItems
CREATE TABLE CartItems (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    CarID INT NOT NULL,
    Quantity INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(ID),
    FOREIGN KEY (CarID) REFERENCES Cars(ID)
);
GO

-- Tạo index để tối ưu tìm kiếm
CREATE INDEX IX_Cars_Brand ON Cars(Brand);
CREATE INDEX IX_Cars_Type ON Cars(Type);
CREATE INDEX IX_Cars_Price ON Cars(Price);
CREATE INDEX IX_CartItems_UserID ON CartItems(UserID);
CREATE INDEX IX_Orders_UserID ON Orders(UserID);
GO

PRINT 'Database setup completed successfully!';

SELECT * FROM Cars 
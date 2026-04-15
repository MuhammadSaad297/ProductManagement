IF DB_ID('ProductManagementDb') IS NULL
BEGIN
    CREATE DATABASE ProductManagementDb;
END
GO

USE ProductManagementDb;
GO

IF OBJECT_ID('dbo.Products', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Products
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(150) NOT NULL,
        Description NVARCHAR(500) NOT NULL CONSTRAINT DF_Products_Description DEFAULT '',
        Price DECIMAL(18,2) NOT NULL,
        StockQuantity INT NOT NULL,
        IsActive BIT NOT NULL CONSTRAINT DF_Products_IsActive DEFAULT 1,
        CreatedOnUtc DATETIME2 NOT NULL CONSTRAINT DF_Products_CreatedOnUtc DEFAULT SYSUTCDATETIME(),
        UpdatedOnUtc DATETIME2 NULL
    );
END
GO

CREATE OR ALTER PROCEDURE dbo.usp_Products_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id,
           Name,
           Description,
           Price,
           StockQuantity,
           IsActive,
           CreatedOnUtc,
           UpdatedOnUtc
    FROM dbo.Products
    ORDER BY Id DESC;
END
GO

CREATE OR ALTER PROCEDURE dbo.usp_Products_GetById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id,
           Name,
           Description,
           Price,
           StockQuantity,
           IsActive,
           CreatedOnUtc,
           UpdatedOnUtc
    FROM dbo.Products
    WHERE Id = @Id;
END
GO

CREATE OR ALTER PROCEDURE dbo.usp_Products_Create
    @Name NVARCHAR(150),
    @Description NVARCHAR(500),
    @Price DECIMAL(18,2),
    @StockQuantity INT,
    @IsActive BIT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Products (Name, Description, Price, StockQuantity, IsActive)
    VALUES (@Name, @Description, @Price, @StockQuantity, @IsActive);

    SELECT CAST(SCOPE_IDENTITY() AS INT);
END
GO

CREATE OR ALTER PROCEDURE dbo.usp_Products_Update
    @Id INT,
    @Name NVARCHAR(150),
    @Description NVARCHAR(500),
    @Price DECIMAL(18,2),
    @StockQuantity INT,
    @IsActive BIT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Products
    SET Name = @Name,
        Description = @Description,
        Price = @Price,
        StockQuantity = @StockQuantity,
        IsActive = @IsActive,
        UpdatedOnUtc = SYSUTCDATETIME()
    WHERE Id = @Id;
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Products)
BEGIN
    INSERT INTO dbo.Products (Name, Description, Price, StockQuantity, IsActive)
    VALUES
    ('Mechanical Keyboard', 'Hot-swappable 75% keyboard', 129.99, 25, 1),
    ('USB-C Dock', 'Dual-monitor dock with power delivery', 89.50, 15, 1),
    ('Noise Cancelling Headphones', 'Wireless over-ear headset', 199.00, 8, 1);
END
GO

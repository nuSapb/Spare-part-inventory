-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SparePartsInventory')
BEGIN
    CREATE DATABASE SparePartsInventory;
END
GO

USE SparePartsInventory;
GO

-- Create Parts Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Parts')
BEGIN
    CREATE TABLE Parts (
        part_id INT IDENTITY(1,1) PRIMARY KEY,
        part_number NVARCHAR(100) NOT NULL UNIQUE,
        description NVARCHAR(500) NOT NULL,
        category NVARCHAR(100) NOT NULL,
        department NVARCHAR(100) NOT NULL,
        location NVARCHAR(200) NOT NULL,
        storage_detail NVARCHAR(200) NULL,
        machine_used NVARCHAR(200) NULL,
        current_stock INT NOT NULL DEFAULT 0,
        minimum_stock INT NOT NULL DEFAULT 0,
        unit NVARCHAR(50) NOT NULL DEFAULT 'piece',
        image_url NVARCHAR(500) NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Create Transactions Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Transactions')
BEGIN
    CREATE TABLE Transactions (
        transaction_id INT IDENTITY(1,1) PRIMARY KEY,
        part_id INT NOT NULL,
        transaction_type NVARCHAR(50) NOT NULL, -- 'issue', 'return', 'receive', 'adjustment'
        quantity INT NOT NULL,
        reference_number NVARCHAR(100) NULL,
        employee_name NVARCHAR(200) NULL,
        department NVARCHAR(100) NULL,
        notes NVARCHAR(500) NULL,
        transaction_date DATETIME2 NOT NULL DEFAULT GETDATE(),
        created_by NVARCHAR(200) NULL,
        FOREIGN KEY (part_id) REFERENCES Parts(part_id) ON DELETE CASCADE
    );
END
GO

-- Create Employees Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Employees')
BEGIN
    CREATE TABLE Employees (
        employee_id INT IDENTITY(1,1) PRIMARY KEY,
        employee_code NVARCHAR(50) NOT NULL UNIQUE,
        name NVARCHAR(200) NOT NULL,
        department NVARCHAR(100) NOT NULL,
        position NVARCHAR(100) NULL,
        email NVARCHAR(200) NULL,
        phone NVARCHAR(50) NULL,
        is_active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Create Stock Alerts Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StockAlerts')
BEGIN
    CREATE TABLE StockAlerts (
        alert_id INT IDENTITY(1,1) PRIMARY KEY,
        part_id INT NOT NULL,
        alert_type NVARCHAR(50) NOT NULL, -- 'low_stock', 'out_of_stock', 'overstocked'
        alert_message NVARCHAR(500) NOT NULL,
        is_acknowledged BIT NOT NULL DEFAULT 0,
        acknowledged_by NVARCHAR(200) NULL,
        acknowledged_at DATETIME2 NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (part_id) REFERENCES Parts(part_id) ON DELETE CASCADE
    );
END
GO

-- Create Indexes
CREATE NONCLUSTERED INDEX IX_Parts_PartNumber ON Parts(part_number);
CREATE NONCLUSTERED INDEX IX_Parts_Category ON Parts(category);
CREATE NONCLUSTERED INDEX IX_Parts_Department ON Parts(department);
CREATE NONCLUSTERED INDEX IX_Parts_Location ON Parts(location);
CREATE NONCLUSTERED INDEX IX_Transactions_PartId ON Transactions(part_id);
CREATE NONCLUSTERED INDEX IX_Transactions_Date ON Transactions(transaction_date DESC);
CREATE NONCLUSTERED INDEX IX_Employees_Department ON Employees(department);
CREATE NONCLUSTERED INDEX IX_StockAlerts_PartId ON StockAlerts(part_id);
GO

-- Create Trigger for updating updated_at
CREATE OR ALTER TRIGGER TR_Parts_UpdatedAt
ON Parts
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Parts
    SET updated_at = GETDATE()
    FROM Parts p
    INNER JOIN inserted i ON p.part_id = i.part_id;
END
GO

CREATE OR ALTER TRIGGER TR_Employees_UpdatedAt
ON Employees
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Employees
    SET updated_at = GETDATE()
    FROM Employees e
    INNER JOIN inserted i ON e.employee_id = i.employee_id;
END
GO

PRINT 'Database schema created successfully!';

# Spare Parts Inventory - Backend API

Backend API server with SQL Server database for the Spare Parts Inventory Management System.

## Setup Instructions

### 1. Start SQL Server with Docker

```bash
# From the root directory (spare-parts-inventory)
docker-compose up -d
```

This will:
- Start SQL Server 2022 in a Docker container
- Create the database and tables automatically
- Insert sample data

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

The `.env` file is already created with default settings:
- Database: `SparePartsInventory`
- SQL Server Port: `1433`
- API Port: `5000`
- Password: `YourStrong@Passw0rd`

### 4. Initialize Database (if needed)

The database is automatically initialized when Docker starts. If you need to manually run the scripts:

```bash
# Connect to SQL Server and run:
# - backend/init-scripts/01-create-database.sql
# - backend/init-scripts/02-seed-data.sql
```

### 5. Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at: `http://localhost:5000`

## API Endpoints

### Parts
- `GET /api/parts` - Get all parts
- `GET /api/parts/:id` - Get single part
- `POST /api/parts` - Create new part
- `PUT /api/parts/:id` - Update part
- `DELETE /api/parts/:id` - Delete part

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee

## Database Schema

### Tables
- **Parts** - Spare parts inventory
- **Transactions** - Stock movements (issue, return, receive, adjustment)
- **Employees** - Employee information
- **StockAlerts** - Low stock and out of stock alerts

## Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f sqlserver

# Restart SQL Server
docker-compose restart sqlserver

# Remove all data (WARNING: deletes all data)
docker-compose down -v
```

## SQL Server Connection Details

- **Host:** localhost
- **Port:** 1433
- **Username:** sa
- **Password:** YourStrong@Passw0rd
- **Database:** SparePartsInventory

## Troubleshooting

### Cannot connect to SQL Server
1. Check if Docker is running: `docker ps`
2. Check SQL Server logs: `docker-compose logs sqlserver`
3. Wait 10-20 seconds after starting for SQL Server to be ready

### Database not initialized
1. Check init scripts ran: `docker-compose logs sqlserver | grep "Database schema"`
2. Manually run scripts using SQL Server Management Studio or Azure Data Studio

### Port already in use
- Change ports in `docker-compose.yml` and `.env` file

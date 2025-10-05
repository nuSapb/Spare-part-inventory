# Spare Parts Inventory Management System

A full-stack inventory management system for spare parts with Next.js frontend and Node.js backend with SQL Server database.

## Project Structure

```
spare-parts-inventory/
├── frontend/              # Next.js 14 Frontend
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── contexts/         # React Context providers
│   ├── lib/             # Utilities and types
│   └── public/          # Static assets
│
├── backend/              # Node.js + Express Backend
│   ├── src/
│   │   ├── routes/      # API routes
│   │   └── index.js     # Express server
│   ├── config/          # Database configuration
│   └── init-scripts/    # SQL initialization scripts
│
└── docker-compose.yml    # SQL Server Docker setup
```

## Quick Start

### 1. Start SQL Server Database

```bash
# From root directory
docker-compose up -d
```

This will start SQL Server in Docker on port 1433 and automatically:
- Create the `SparePartsInventory` database
- Create all tables (Parts, Transactions, Employees, StockAlerts)
- Insert sample data

### 2. Start Backend API

```bash
cd backend
npm install
npm run dev
```

Backend API will run on `http://localhost:5000`

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## Features

### Current Features
- ✅ Parts catalog management (CRUD operations)
- ✅ Stock level tracking
- ✅ Low stock alerts
- ✅ CSV import/export
- ✅ Search and filtering
- ✅ Multiple storage locations
- ✅ Department-based organization
- ✅ Image support for parts

### Planned Features
- 🔄 Connect frontend to backend API
- 🔄 Transaction history tracking
- 🔄 Employee management
- 🔄 Real-time stock alerts
- 🔄 Barcode/QR code scanning
- 🔄 Reports and analytics

## Technology Stack

### Frontend
- **Framework:** Next.js 14.2.16 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Components:** Radix UI + shadcn/ui
- **Charts:** Recharts
- **Language:** TypeScript

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Microsoft SQL Server 2022
- **ORM:** mssql (node-mssql)
- **Containerization:** Docker

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

### Parts Table
- `part_id` (INT, Primary Key)
- `part_number` (NVARCHAR, Unique)
- `description` (NVARCHAR)
- `category` (NVARCHAR)
- `department` (NVARCHAR)
- `location` (NVARCHAR)
- `storage_detail` (NVARCHAR, nullable)
- `machine_used` (NVARCHAR, nullable)
- `current_stock` (INT)
- `minimum_stock` (INT)
- `unit` (NVARCHAR)
- `image_url` (NVARCHAR, nullable)
- `created_at` (DATETIME2)
- `updated_at` (DATETIME2)

See `backend/init-scripts/01-create-database.sql` for complete schema.

## Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
```

### Backend Development
```bash
cd backend
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
```

### Docker Commands
```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs -f sqlserver

# Remove all data (WARNING: deletes everything)
docker-compose down -v
```

## Environment Variables

### Backend (.env)
```env
DB_USER=sa
DB_PASSWORD=YourStrong@Passw0rd
DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=SparePartsInventory
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private project

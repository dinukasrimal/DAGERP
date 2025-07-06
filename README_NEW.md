# Garment Factory ERP System

A comprehensive ERP system for garment manufacturing businesses with 2 branches. The system handles the complete workflow from order entry to final invoicing.

## Features Implemented

### Phase 1 (Completed)
- ✅ **Project Setup**: React TypeScript application with Material-UI
- ✅ **Database Schema**: Comprehensive Prisma schema for all core entities
- ✅ **Order Management Module**: 
  - Order entry with pack-based configuration (3-pack, 5-pack, etc.)
  - Style selection with color and size allocation
  - Dynamic customer and style management
  - Order status tracking

### Phase 2-4 (Planned)
- 🔄 **Style Master & BOM Management**
- 🔄 **BOM Generation & Processing**  
- 🔄 **Budget Creation & Approval**
- 🔄 **Purchase Management**
- 🔄 **Inventory Management**
- 🔄 **Production Tracking**
- 🔄 **Reports & Invoicing**

## Tech Stack

- **Frontend**: React 18, TypeScript, Material-UI v5
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Context (planned)
- **Authentication**: Role-based access control (planned)

## Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (Layout, etc.)
│   ├── orders/          # Order-specific components
│   ├── styles/          # Style management components
│   ├── bom/             # BOM components
│   ├── budget/          # Budget components
│   ├── purchase/        # Purchase components
│   ├── inventory/       # Inventory components
│   └── production/      # Production components
├── pages/               # Page components
├── services/            # API service functions
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
└── context/             # React context providers
```

## Database Schema

The system uses a comprehensive database schema with the following key entities:

- **Branch**: Multi-branch support
- **User**: Role-based user management
- **Customer**: Customer information
- **SalesOrder**: Order management with multiple POs
- **Style**: Style master with sizes and colors
- **BOMItem**: Bill of materials with prefix system
- **Budget**: Budget creation and approval workflow
- **Inventory**: Stock management with barcode support
- **Production**: Bundle tracking through departments

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `DATABASE_URL` in `.env`

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Start the development server:
   ```bash
   npm start
   ```

6. Build for production:
   ```bash
   npm run build
   ```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

## Key Features

### Order Management
- Pack-based order entry (3-pack, 5-pack configurations)
- Multiple POs under single Sales Order
- Color and size allocation per style
- Customer management integration

### BOM System (Planned)
- Size-specific, color-specific, and combination BOM items
- Dual unit system (Plan Unit vs Purchase Unit)
- Smart prefix system for sub-materials
- Automatic quantity calculations

### Production Tracking (Planned)
- Barcode-enabled material movement
- Department-wise tracking (Cutting, Sewing, Packing)
- Bundle management system
- Real-time production status

### Inventory Management (Planned)
- GRN functionality with barcode generation
- Roll/bundle tracking
- Multi-unit support (KG, Meters, Pieces)
- Return goods handling

## Security Features (Planned)
- Role-based access control
- Branch-wise data separation  
- Approval workflows
- Audit trail for all transactions

## Development Status

The project is currently in Phase 1 with basic order management functionality. The foundation is solid with a comprehensive database schema and clean architecture ready for the remaining modules.

## License

This project is proprietary software for garment manufacturing businesses.
# Orders Microservice

A NestJS-based microservice for managing orders in a microservices architecture. This service provides order management functionality with PostgreSQL database integration and NATS messaging system.

## Features

- **Order Management**: Create, retrieve, and update orders with order items
- **Status Management**: Change order status (PENDING, DELIVERED, CANCELLED)
- **Database Integration**: PostgreSQL with Prisma ORM
- **Microservice Architecture**: NATS-based communication using NestJS microservices
- **Data Validation**: Input validation with class-validator
- **Pagination**: Support for paginated order queries with status filtering
- **Type Safety**: Full TypeScript support
- **Service Integration**: Communicates with Products microservice via NATS
- **Product Validation**: Validates product availability and pricing before order creation

## Installation

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. Set up environment variables:
    ```bash
    cp .env.template .env
    ```

4. Configure your environment variables in `.env`:

5. **Start the database**
   ```bash
   docker compose up -d
   ```

6. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

7. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## Database

The service uses PostgreSQL as the primary database with the following schema:

## Docker

The project includes a Docker Compose configuration for the PostgreSQL database:

```yaml
services:
  orders-db:
    container_name: orders_database
    image: postgres:17
    ports:
      - 5432:5432
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=12345
      - POSTGRES_DB=ordersdb
```

To start the database:
```bash
docker compose up -d
```

## Project Structure

```
src/
├── app.module.ts          # Main application module
├── main.ts               # Application entry point
├── common/               # Shared DTOs and utilities
│   ├── index.ts
│   └── dto/
│       └── pagination.dto.ts
├── config/               # Configuration files
│   ├── envs.ts          # Environment variables
│   ├── services.ts      # Service constants
│   └── index.ts
├── orders/               # Orders module
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   ├── orders.module.ts
│   ├── dto/              # Order-specific DTOs
│   │   ├── create-order.dto.ts
│   │   ├── change-order-status.dto.ts
│   │   ├── order-item.dto.ts
│   │   ├── order-pagination.dto.ts
│   │   └── index.ts
│   └── enum/             # Order enums
│       └── order.enum.ts
└── transports/           # Transport layer configuration
    └── nats.module.ts    # NATS client configuration
```

## Service Dependencies

This microservice integrates with other services in the microservices architecture:

- **Products Microservice**: Validates product information and pricing when creating orders
  - Communication: NATS messaging system
  - Message Pattern: `validate_products`
  - Purpose: Ensures product availability and retrieves current pricing

**Note**: This microservice is designed to work with other services in a distributed architecture using NATS as the message broker. Ensure proper NATS configuration and service discovery setup in your deployment environment.

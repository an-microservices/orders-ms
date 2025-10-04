# Orders Microservice

A NestJS-based microservice for managing orders in a microservices architecture. This service provides order management functionality with PostgreSQL database integration and TCP communication.

## Features

- **Order Management**: Create, retrieve, and update orders
- **Status Management**: Change order status (PENDING, DELIVERED, CANCELLED)
- **Database Integration**: PostgreSQL with Prisma ORM
- **Microservice Architecture**: TCP-based communication using NestJS microservices
- **Data Validation**: Input validation with class-validator
- **Pagination**: Support for paginated order queries
- **Type Safety**: Full TypeScript support

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
│   └── dto/
├── config/               # Configuration files
│   ├── envs.ts          # Environment variables
│   └── index.ts
└── orders/               # Orders module
    ├── orders.controller.ts
    ├── orders.service.ts
    ├── orders.module.ts
    ├── dto/              # Order-specific DTOs
    └── enum/             # Order enums
```

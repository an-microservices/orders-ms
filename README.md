# Orders Microservice

A NestJS-based microservice for managing orders in a microservices architecture. This service provides order management functionality with PostgreSQL database integration, NATS messaging system, and Stripe payment integration.

## Features

- **Order Management**: Create, retrieve, and update orders with order items
- **Payment Integration**: Stripe payment session creation and webhook handling
- **Status Management**: Change order status (PENDING, PAID, DELIVERED, CANCELLED)
- **Database Integration**: PostgreSQL with Prisma ORM
- **Microservice Architecture**: NATS-based communication using NestJS microservices
- **Data Validation**: Input validation with class-validator
- **Pagination**: Support for paginated order queries with status filtering
- **Type Safety**: Full TypeScript support
- **Service Integration**: Communicates with Products and Payments microservices via NATS
- **Product Validation**: Validates product availability and pricing before order creation
- **Payment Event Handling**: Listens to payment success events and updates order status automatically

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

The service uses PostgreSQL as the primary database with Prisma ORM. The database schema includes:

## Payment Integration

The service integrates with Stripe for payment processing:

1. **Order Creation**: When an order is created, a Stripe payment session is automatically generated
2. **Payment Session**: Returns Stripe checkout URL for customer payment
3. **Webhook Events**: Listens to `payment.succeeded` events from the Payments microservice
4. **Auto-Update**: Automatically updates order status to PAID when payment succeeds
5. **Payment Tracking**: Stores Stripe charge ID and payment timestamp

### Payment Flow
```
Client → Create Order → Orders MS
                    ↓
              Products MS (validate)
                    ↓
              Payments MS (create session)
                    ↓
              Stripe Checkout URL
                    ↓
        Customer completes payment
                    ↓
              Stripe Webhook
                    ↓
              Payments MS
                    ↓
       Orders MS (update to PAID)
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

- **Payments Microservice**: Handles Stripe payment session creation and webhook processing
  - Communication: NATS messaging system
  - Message Pattern: `create.payment.session`
  - Event Pattern: `payment.succeeded` (listens for payment confirmations)
  - Purpose: Creates Stripe checkout sessions and notifies when payments succeed

**Note**: This microservice is designed to work with other services in a distributed architecture using NATS as the message broker. Ensure proper NATS configuration and service discovery setup in your deployment environment.
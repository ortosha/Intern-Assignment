To run this project locally:
1. Clone the repository:
git clone https://github.com/PERSONAL/Intern-Assignment.git
2. Navigate to the project folder:
cd Intern-Assignment
3. Install dependencies:
npm install
4. Start the development server:
npm run dev
5. Open your browser and go to:
http://localhost:3000
Make sure you have Node.js and npm installed on your computer.

# Ghala Commerce Simulation System

A simplified system that simulates how Ghala handles merchant payment configuration and order processing for WhatsApp commerce.

## System Overview

Ghala powers WhatsApp commerce by allowing merchants to configure their preferred payment methods and processing customer orders with real-time status updates.

### Key Features

- **Multi-Merchant Support**: Each merchant can configure unique payment methods (mobile money, card, bank transfer)
- **Order Processing**: Customers can place orders with automatic status tracking (pending → paid/failed)
- **Payment Simulation**: Mock payment confirmation with async processing (5-second delay)
- **Real-time Updates**: Order status updates with automatic refresh
- **Clean Admin UI**: Separate dashboards for merchants and platform administrators

## Architecture & Scalability

### Current Architecture

**Frontend**: React + TypeScript with Tailwind CSS for clean, responsive UI
**State Management**: React Context + React Query for efficient data fetching
**Data Storage**: LocalStorage-based mock database for development
**Authentication**: Mock auth system with role-based access (merchant/admin)

### Multi-Merchant Support

The system supports multiple merchants through:
- **Unique Merchant IDs**: Each merchant has a distinct identifier
- **Isolated Configurations**: Separate payment configs per merchant
- **Role-based Access**: Merchants only see their own orders and settings
- **Admin Overview**: Platform admins can view all merchants and orders

### Commission Rate Extension

To support different commission rates per merchant:

```typescript
interface Merchant {
  // ... existing fields
  commissionRate: number; // e.g., 0.03 for 3%
  commissionTier: 'basic' | 'premium' | 'enterprise';
  volumeDiscounts: {
    threshold: number;
    discountRate: number;
  }[];
}
```

**Implementation Strategy**:
- Store commission rates in merchant profiles
- Calculate commissions during payment processing
- Generate commission reports for financial tracking
- Implement tier-based pricing with volume discounts

### Scaling to 10,000+ Merchants

**Database Architecture**:
- **Migrate to PostgreSQL/MongoDB**: Replace localStorage with production database
- **Database Indexing**: Index merchant_id, order_status, created_at for fast queries
- **Data Partitioning**: Partition orders by merchant_id or date ranges

**Performance Optimizations**:
- **Redis Caching**: Cache frequently accessed merchant configurations
- **CDN Integration**: Serve static assets and images via CDN
- **Database Connection Pooling**: Manage database connections efficiently

**Infrastructure Scaling**:
- **Microservices Architecture**: Separate services for merchants, orders, payments
- **Message Queues**: Use Redis/RabbitMQ for async payment processing
- **Load Balancing**: Distribute traffic across multiple app instances
- **Auto-scaling**: Kubernetes/Docker for container orchestration

**Monitoring & Analytics**:
- **Application Monitoring**: New Relic/DataDog for performance tracking
- **Business Metrics**: Real-time dashboards for order volumes, success rates
- **Alert Systems**: Automated alerts for failed payments or system issues

## Development Setup

### Demo Accounts
- **Admin**: admin@ghala.com / password
- **Merchant**: merchant@example.com / password

### Local Development
```bash
npm install
npm run dev
```

### Tech Stack
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui components
- React Query for state management
- Date-fns for date formatting
- Mock localStorage database

## Key Components

### Payment Configuration
Merchants can configure three payment methods:
- **Mobile Money**: M-Pesa, Airtel Money, T-Kash
- **Card Payments**: Stripe, PayPal, Flutterwave
- **Bank Transfers**: Local bank account details

### Order Management
- Create orders with customer details and products
- Track order status in real-time
- Simulate payment confirmation with 80% success rate
- View order history and analytics

### Authentication & Authorization
- Role-based access control
- Session management
- Secure merchant data isolation

## Future Enhancements

1. **Real Payment Integration**: Connect to actual payment processors
2. **WhatsApp Bot Integration**: Process orders directly from WhatsApp
3. **Inventory Management**: Track product stock levels
4. **Advanced Analytics**: Revenue forecasting, merchant insights
5. **Multi-currency Support**: Handle different currencies and exchange rates
6. **Automated Reconciliation**: Match payments with orders automatically

## Production Considerations

- **Security**: Implement proper authentication, encryption, and input validation
- **Compliance**: PCI DSS compliance for card payments, data protection regulations
- **Backup & Recovery**: Regular database backups and disaster recovery plans
- **API Rate Limiting**: Protect against abuse and ensure fair usage
- **Documentation**: Comprehensive API documentation for integrations

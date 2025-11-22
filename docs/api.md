# FireLink System API Documentation

## Base URL https://api.firelinksystem.com/v1

## Authentication
All endpoints require JWT authentication unless specified.

## Endpoints

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Jobs
- `GET /api/jobs` - List jobs with filtering
- `POST /api/jobs` - Create job
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `GET /api/jobs/:id/profitability` - Get job P&L

### Scheduling
- `GET /api/scheduling/engineers` - Get available engineers
- `POST /api/scheduling/assign` - Assign engineer to job
- `GET /api/scheduling/calendar` - Get schedule calendar

### Financial
- `POST /api/invoices` - Create invoice
- `POST /api/invoices/:id/send` - Send invoice to customer
- `POST /api/payments` - Process payment

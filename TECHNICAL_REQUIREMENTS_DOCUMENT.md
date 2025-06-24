
# KlinRide Car Detailing Service - Technical Requirements Document

## Project Overview

KlinRide is a comprehensive car detailing service management platform that handles customer bookings, job management, technician assignments, and financial tracking. The system provides both customer-facing booking capabilities and a complete admin dashboard for business operations.

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/UI Components
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **State Management**: React hooks + Tanstack Query for server state
- **Routing**: React Router DOM v6
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Export**: XLSX for Excel export functionality

## Database Schema

### Core Tables

1. **customers**
   - `id` (UUID, Primary Key)
   - `name` (Text, Required)
   - `email` (Text)
   - `phone` (Text, Required)
   - `location` (Text)
   - `created_at`, `updated_at` (Timestamps)

2. **services**
   - `id` (UUID, Primary Key)
   - `name` (Text, Required)
   - `description` (Text)
   - `price` (Numeric, Required)
   - `active` (Boolean, Default: true)
   - `created_at`, `updated_at` (Timestamps)

3. **technicians**
   - `id` (UUID, Primary Key)
   - `name` (Text, Required)
   - `email` (Text)
   - `phone` (Text)
   - `active` (Boolean, Default: true)
   - `created_at`, `updated_at` (Timestamps)

4. **bookings**
   - `id` (UUID, Primary Key)
   - `booking_reference` (Text, Auto-generated)
   - `customer_id` (UUID, FK to customers)
   - `date` (Date, Required)
   - `time` (Time, Required)
   - `location` (Text, Required)
   - `total_amount` (Numeric, Required)
   - `status` (Text: Draft, Scheduled, InProgress, Completed, Cancelled)
   - `notes` (Text)
   - `created_at`, `updated_at` (Timestamps)

5. **booking_services** (Junction table)
   - `booking_id` (UUID, FK to bookings)
   - `service_id` (UUID, FK to services)
   - `quantity` (Integer, Default: 1)
   - `price_at_booking` (Numeric, Required)

6. **jobs**
   - `id` (UUID, Primary Key)
   - `job_reference` (Text, Auto-generated)
   - `booking_id` (UUID, FK to bookings)
   - `technician_id` (UUID, FK to technicians)
   - `date` (Date, Required)
   - `start_time`, `end_time` (Timestamps)
   - `status` (Text: Scheduled, InProgress, Completed, Cancelled)
   - `notes` (Text)
   - `created_at`, `updated_at` (Timestamps)

7. **invoices**
   - `id` (UUID, Primary Key)
   - `invoice_number` (Text, Auto-generated)
   - `job_id` (UUID, FK to jobs)
   - `customer_id` (UUID, FK to customers)
   - `issue_date`, `due_date` (Dates)
   - `amount`, `tax_amount`, `total_amount` (Numeric)
   - `payment_date` (Date, Optional)
   - `payment_method` (Text)
   - `payment_status` (Text: Pending, Paid, Overdue)
   - `notes` (Text)
   - `created_at`, `updated_at` (Timestamps)

8. **settings**
   - `id` (Text, Primary Key)
   - `category` (Text, Required)
   - `name` (Text, Required)
   - `description` (Text)
   - `value` (JSONB)
   - `updated_at` (Timestamp)

## Application Architecture

### Public Website Structure

```
/ (Homepage)
├── /about (About Us)
├── /services (Service Listings)
├── /pricing (Pricing Information)
├── /contact (Contact Form)
└── /booking (Customer Booking Form)
```

### Admin Dashboard Structure

```
/admin/login (Authentication)
/admin/dashboard (Main Dashboard)
├── /admin/customers (Customer Management)
├── /admin/bookings (Booking Management)
├── /admin/jobs (Job Management & Technician Assignment)
├── /admin/technicians (Technician Management)
├── /admin/accounting (Financial Overview)
└── /admin/settings (System Configuration)
```

## Core Features & Requirements

### 1. Customer-Facing Features

#### Homepage
- Hero section with service overview
- Service preview cards
- How it works section
- Customer testimonials
- Call-to-action sections

#### Service Booking System
- Multi-step booking form
- Service selection with pricing
- Date/time picker with availability checking
- Customer information collection
- Location input
- Booking confirmation with reference number
- Email confirmations (to be implemented)

#### Responsive Design
- Mobile-first approach
- Fully responsive across all device sizes
- Touch-friendly interface

### 2. Admin Dashboard Features

#### Authentication System
- Admin login/logout
- Session management
- Protected routes
- Role-based access (foundation for future expansion)

#### Dashboard Analytics
- **Key Metrics Display:**
  - Total bookings (all-time)
  - Completed bookings
  - Cancelled bookings
  - Total customers
  - Active customers (last 3 months)
  - Bookings today
  - Pending jobs

- **Revenue Analytics:**
  - Monthly revenue (current month completed bookings)
  - Confirmed revenue (from paid invoices)
  - Outstanding revenue (pending/overdue invoices)
  - Projected revenue (total booking value minus confirmed)
  - Revenue trends (6-month chart)

- **Quick Actions:**
  - Today's bookings overview
  - Pending job alerts
  - Revenue summary cards

#### Customer Management
- View all customers
- Customer profile management
- Search and filter capabilities
- Contact information tracking
- Booking history per customer

#### Booking Management
- **Dual View System:**
  - List view (table format)
  - Calendar view (monthly calendar)

- **Booking Operations:**
  - Create new bookings (admin-initiated)
  - Edit existing bookings
  - Status management (Draft → Scheduled → InProgress → Completed/Cancelled)
  - Real-time status updates
  - Search by customer name, booking reference
  - Filter by status, date range
  - Bulk operations support

- **Booking Lifecycle:**
  - Draft: Initial creation state
  - Scheduled: Confirmed and scheduled
  - InProgress: Work has begun
  - Completed: Service finished
  - Cancelled: Booking cancelled

#### Job Management & Technician Assignment
- **Unified Jobs View:**
  - Displays both actual jobs AND InProgress/Completed bookings as jobs
  - Booking-based jobs marked with "(Booking)" indicator
  - Real-time synchronization between bookings and jobs

- **Technician Assignment System:**
  - Assign technicians to jobs/bookings when status changes to InProgress
  - Dropdown selection of active technicians
  - Real-time assignment updates
  - Support for reassignment
  - Unassignment capability

- **Job Operations:**
  - Status management with color-coded indicators
  - Job reference tracking
  - Service details display
  - Customer information
  - Date and location tracking
  - Amount visibility

- **Automated Job Creation:**
  - Batch create jobs from scheduled bookings
  - Prevents duplicate job creation
  - Maintains booking-job relationships

#### Technician Management
- **CRUD Operations:**
  - Create new technicians
  - Edit technician information
  - Activate/deactivate technicians
  - Delete technicians (with proper validation)

- **Technician Profiles:**
  - Name, email, phone contact details
  - Active status management
  - Job assignment history
  - Performance tracking foundation

#### Financial Management (Accounting)
- **Revenue Tracking:**
  - Confirmed revenue (paid invoices)
  - Outstanding revenue (pending payments)
  - Projected revenue calculations
  - Monthly revenue trends

- **Invoice Management:**
  - Generate invoices from completed jobs
  - Payment status tracking
  - Due date management
  - Payment method recording

- **Financial Reporting:**
  - Revenue by month charts
  - Payment status distribution
  - Outstanding invoice alerts
  - Export capabilities

#### System Settings
- **Service Configuration:**
  - Add/edit/remove services
  - Pricing management
  - Service descriptions
  - Active/inactive status

- **Business Settings:**
  - Company information
  - Contact details
  - Business hours
  - Terms and conditions

- **System Preferences:**
  - Default values
  - Notification settings
  - User preferences

### 3. Data Export & Reporting

#### Export Capabilities
- Excel export for all major data sets
- Customizable date ranges
- Filtered data export
- Multiple sheet support
- Formatted financial data

#### Reporting Features
- Booking reports by status, date, customer
- Revenue reports with breakdowns
- Technician performance reports
- Customer activity reports

## Business Logic & Workflow

### Booking to Job Workflow
1. **Customer Booking:** Customer creates booking (Draft status)
2. **Admin Review:** Admin reviews and confirms (Scheduled status)
3. **Job Initiation:** When work begins, status changes to InProgress
4. **Technician Assignment:** Admin assigns technician when status becomes InProgress
5. **Job Completion:** Status changes to Completed
6. **Invoice Generation:** System can generate invoices for completed jobs
7. **Payment Tracking:** Payment status and details tracked in accounting

### Revenue Recognition
- **Confirmed Revenue:** Sum of all paid invoices
- **Outstanding Revenue:** Sum of pending/overdue invoices
- **Projected Revenue:** Total booking value minus confirmed revenue
- **Monthly Revenue:** Completed bookings in current month

### Data Relationships
- One customer can have multiple bookings
- One booking can have multiple services (many-to-many)
- One booking can generate one job
- One job can have one assigned technician
- One job can generate one invoice
- One invoice tracks payment for one job

## Security Requirements

### Authentication
- Secure admin login system
- Session management with automatic logout
- Password protection for admin areas
- Future: Role-based access control

### Data Protection
- Input validation on all forms
- SQL injection prevention (handled by Supabase)
- XSS prevention
- Secure data transmission (HTTPS)

### Authorization
- Admin-only access to dashboard features
- Public access to booking system
- Future: Technician portal with limited access

## Performance Requirements

### Response Times
- Page load times under 2 seconds
- Database queries optimized for quick responses
- Real-time updates for critical operations

### Scalability
- Support for growing customer base
- Efficient database indexing
- Optimized queries for large datasets

### Reliability
- 99.9% uptime target
- Error handling and graceful degradation
- Data backup and recovery procedures

## Integration Requirements

### Current Integrations
- Supabase for backend services
- Email system (foundation prepared)
- Excel export functionality

### Future Integrations
- SMS notifications
- Payment processing (Stripe/PayPal)
- Email marketing tools
- Calendar synchronization
- Mobile app API

## Development Standards

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Component-based architecture
- Reusable UI components (Shadcn/UI)

### Testing Strategy
- Unit tests for business logic
- Integration tests for critical paths
- End-to-end testing for user workflows
- Performance testing for database operations

### Documentation
- Code comments for complex logic
- API documentation
- User manuals for admin features
- Development setup guides

## Deployment & Infrastructure

### Current Setup
- Frontend deployment via Lovable platform
- Supabase for backend infrastructure
- CDN for static assets
- SSL/TLS encryption

### Production Requirements
- Custom domain support
- Environment variable management
- Database backups
- Monitoring and logging
- Error tracking

## Future Enhancements (Roadmap)

### Phase 2 Features
- Email notifications system
- SMS notifications
- Customer portal for booking management
- Advanced reporting and analytics
- Mobile application

### Phase 3 Features
- Payment processing integration
- Inventory management
- Staff scheduling system
- Customer loyalty program
- Advanced job routing

### Phase 4 Features
- Multi-location support
- Franchise management
- Advanced analytics and BI
- API for third-party integrations
- White-label solutions

## Technical Considerations

### Database Optimization
- Proper indexing on frequently queried columns
- Query optimization for dashboard analytics
- Data archiving strategy for old records
- Backup and recovery procedures

### Monitoring & Maintenance
- Application performance monitoring
- Database performance tracking
- Error logging and alerting
- Regular security updates
- Data integrity checks

### Scalability Considerations
- Database connection pooling
- Caching strategies for frequently accessed data
- CDN usage for static assets
- Load balancing for high traffic

## Conclusion

This technical requirements document outlines a comprehensive car detailing service management platform that handles the complete business workflow from customer booking to job completion and financial tracking. The system is built with modern web technologies and follows best practices for security, performance, and maintainability.

The platform successfully integrates customer-facing booking capabilities with a powerful admin dashboard that provides complete business management functionality including technician assignment, job tracking, and detailed financial analytics.

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Prepared By:** AI Assistant  
**Review Status:** Ready for Technical Team Review

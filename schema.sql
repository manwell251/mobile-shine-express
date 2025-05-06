
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers Table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT NOT NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services Table (for service types)
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL CHECK (status IN ('Draft', 'Scheduled', 'InProgress', 'Completed', 'Cancelled')),
    total_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking Services Junction Table (many-to-many relationship)
CREATE TABLE booking_services (
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    price_at_booking NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY (booking_id, service_id)
);

-- Technicians Table
CREATE TABLE technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs Table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_reference TEXT UNIQUE NOT NULL,
    booking_id UUID REFERENCES bookings(id),
    technician_id UUID REFERENCES technicians(id),
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Scheduled', 'InProgress', 'Completed', 'Cancelled')),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices Table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT UNIQUE NOT NULL,
    job_id UUID REFERENCES jobs(id),
    customer_id UUID REFERENCES customers(id),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('Pending', 'Paid', 'Overdue', 'Cancelled')),
    payment_date DATE,
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings Table
CREATE TABLE settings (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    value JSONB,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default services
INSERT INTO services (name, description, price, active) VALUES
('Basic Wash Package', 'Exterior wash with tire and wheel cleaning', 25000, true),
('Full-Service Wash Package', 'Basic wash plus interior cleaning', 35000, true),
('Premium Detail Package', 'Full-service wash with wax application', 50000, true),
('Headlight Restoration', 'Restore and polish cloudy headlights', 20000, true),
('Complete Detailing Package', 'Full interior & exterior detail with engine bay cleaning', 150000, true);

-- Insert default settings
INSERT INTO settings (id, category, name, value, description) VALUES
('business_info', 'business', 'contact_details', '{"name": "Klin Ride Mobile Car Detailing", "email": "klinride25@gmail.com", "phone": "+256 776 041 056", "address": "L2B Butenga Estate, Kira-Kasangati Rd"}', 'Business contact information'),
('booking_settings', 'system', 'scheduling', '{"allow_same_day_bookings": true, "require_phone_verification": false, "send_sms_reminders": false}', 'Booking system settings'),
('time_slots', 'system', 'scheduling', '{"start_time": "08:00", "end_time": "18:00", "slot_duration": 60}', 'Service time slot settings');

-- Create sample technicians
INSERT INTO technicians (name, email, phone, active) VALUES
('Michael K.', 'michael@klinride.com', '+256 700 111 222', true),
('James M.', 'james@klinride.com', '+256 700 333 444', true),
('David N.', 'david@klinride.com', '+256 700 555 666', true);

-- Create functions for generating reference numbers
CREATE OR REPLACE FUNCTION generate_booking_reference() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_reference := 'BK' || TO_CHAR(NOW(), 'YYMM') || LPAD(NEXTVAL('booking_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_job_reference() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.job_reference := 'J' || TO_CHAR(NOW(), 'YYMM') || LPAD(NEXTVAL('job_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_invoice_number() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.invoice_number := 'INV' || TO_CHAR(NOW(), 'YYMM') || LPAD(NEXTVAL('invoice_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequences for reference numbers
CREATE SEQUENCE booking_seq START 1;
CREATE SEQUENCE job_seq START 1;
CREATE SEQUENCE invoice_seq START 1;

-- Create triggers to automatically generate reference numbers
CREATE TRIGGER set_booking_reference
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION generate_booking_reference();

CREATE TRIGGER set_job_reference
BEFORE INSERT ON jobs
FOR EACH ROW
EXECUTE FUNCTION generate_job_reference();

CREATE TRIGGER set_invoice_number
BEFORE INSERT ON invoices
FOR EACH ROW
EXECUTE FUNCTION generate_invoice_number();

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies (assuming authenticated users can access everything for now)
CREATE POLICY "Allow authenticated users full access to customers" ON customers
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to services" ON services
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to bookings" ON bookings
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to booking_services" ON booking_services
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to technicians" ON technicians
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to jobs" ON jobs
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to invoices" ON invoices
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to settings" ON settings
    USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_jobs_booking_id ON jobs(booking_id);
CREATE INDEX idx_jobs_technician_id ON jobs(technician_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_date ON jobs(date);
CREATE INDEX idx_invoices_job_id ON invoices(job_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_payment_status ON invoices(payment_status);

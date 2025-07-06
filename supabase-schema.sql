-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('OPERATOR', 'SUPERVISOR', 'MANAGER', 'ADMIN');
CREATE TYPE order_status AS ENUM ('PENDING', 'APPROVED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED');

-- Branches table
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role DEFAULT 'OPERATOR',
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Styles table
CREATE TABLE styles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    style_code VARCHAR(100) UNIQUE NOT NULL,
    style_name VARCHAR(255) NOT NULL,
    description TEXT,
    available_sizes TEXT[] DEFAULT '{}',
    available_colors TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Orders table
CREATE TABLE sales_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    supplier_reference VARCHAR(255),
    order_date DATE NOT NULL,
    delivery_date DATE,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    status order_status DEFAULT 'PENDING',
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Styles table (junction table for orders and styles)
CREATE TABLE order_styles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sales_order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
    style_id UUID NOT NULL REFERENCES styles(id) ON DELETE CASCADE,
    pack_quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Color Allocations table
CREATE TABLE color_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_style_id UUID NOT NULL REFERENCES order_styles(id) ON DELETE CASCADE,
    color VARCHAR(100) NOT NULL,
    packs INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Size Allocations table
CREATE TABLE size_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_style_id UUID NOT NULL REFERENCES order_styles(id) ON DELETE CASCADE,
    size VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_sales_orders_customer_id ON sales_orders(customer_id);
CREATE INDEX idx_sales_orders_branch_id ON sales_orders(branch_id);
CREATE INDEX idx_sales_orders_order_date ON sales_orders(order_date);
CREATE INDEX idx_sales_orders_status ON sales_orders(status);
CREATE INDEX idx_order_styles_sales_order_id ON order_styles(sales_order_id);
CREATE INDEX idx_order_styles_style_id ON order_styles(style_id);
CREATE INDEX idx_color_allocations_order_style_id ON color_allocations(order_style_id);
CREATE INDEX idx_size_allocations_order_style_id ON size_allocations(order_style_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_styles_updated_at BEFORE UPDATE ON styles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_orders_updated_at BEFORE UPDATE ON sales_orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_styles_updated_at BEFORE UPDATE ON order_styles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_color_allocations_updated_at BEFORE UPDATE ON color_allocations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_size_allocations_updated_at BEFORE UPDATE ON size_allocations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default branch
INSERT INTO branches (name, address, phone, email) VALUES 
('Main Branch', '123 Business Street, City, Country', '+1-234-567-8900', 'main@garment-erp.com');

-- Insert sample customers
INSERT INTO customers (name, email, phone, address) VALUES 
('ABC Fashion Ltd', 'abc@fashion.com', '123-456-7890', '123 Main St'),
('XYZ Garments', 'xyz@garments.com', '098-765-4321', '456 Oak Ave'),
('Fashion Forward Inc', 'info@fashionforward.com', '555-123-4567', '789 Fashion Blvd');

-- Insert sample styles
INSERT INTO styles (style_code, style_name, description, available_sizes, available_colors) VALUES 
('ST-001', 'Classic T-Shirt', 'Basic cotton t-shirt', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Red', 'Blue', 'Green', 'White']),
('ST-002', 'Polo Shirt', 'Cotton polo shirt', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Navy', 'White', 'Gray', 'Black']),
('ST-003', 'Hoodie', 'Comfortable hoodie', ARRAY['M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Gray', 'Navy', 'Maroon']);

-- Set up Row Level Security (RLS)
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE size_allocations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can restrict these later)
CREATE POLICY "Enable read access for all users" ON branches FOR SELECT USING (true);
CREATE POLICY "Enable all access for all users" ON customers FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON styles FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON sales_orders FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON order_styles FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON color_allocations FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON size_allocations FOR ALL USING (true);
-- ============================================================
-- FOODWISE: SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- ============================================================

-- Enable PostGIS / UUID extensions if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL CHECK (role IN ('consumer', 'provider', 'individual_seller', 'rescue_partner', 'admin')),
    city VARCHAR(100) DEFAULT 'Coimbatore',
    area VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROVIDERS (COMMERCIAL KITCHENS)
CREATE TABLE IF NOT EXISTS providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL CHECK (business_type IN ('RESTAURANT', 'HOTEL', 'BAKERY', 'SUPERMARKET', 'CATERER', 'EVENT_ORGANIZER', 'OTHER')),
    fssai_license VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    phone VARCHAR(50),
    description TEXT,
    rating DOUBLE PRECISION DEFAULT 4.8,
    meals_rescued_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INDIVIDUAL SELLERS (HOUSEHOLD EXCESS)
CREATE TABLE IF NOT EXISTS individual_sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RESCUE PARTNERS (VERIFIED NGOS / CHARITIES)
CREATE TABLE IF NOT EXISTS rescue_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100) NOT NULL CHECK (organization_type IN ('NGO', 'Charity', 'Community Kitchen', 'Shelter', 'Food Redistribution')),
    registration_number VARCHAR(100) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(50) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    pickup_capacity INT DEFAULT 200,
    operating_hours VARCHAR(100) DEFAULT '10:00 AM - 10:00 PM',
    vehicle_availability VARCHAR(255),
    beneficiaries_served_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FOOD LISTINGS
CREATE TABLE IF NOT EXISTS food_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES individual_sellers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('MEALS', 'BAKERY', 'SNACKS', 'BEVERAGES', 'DESSERTS', 'BREAKFAST', 'CATERING', 'FRESH_PRODUCE', 'DAIRY', 'GROCERIES', 'OTHER')),
    description TEXT,
    listing_type VARCHAR(50) DEFAULT 'COMMERCIAL' CHECK (listing_type IN ('COMMERCIAL', 'INDIVIDUAL_SELL', 'INDIVIDUAL_DONATE')),
    quantity INT NOT NULL CHECK (quantity >= 0),
    remaining_quantity INT NOT NULL CHECK (remaining_quantity >= 0),
    unit VARCHAR(50) NOT NULL,
    original_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discounted_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    prepared_at TIMESTAMPTZ NOT NULL,
    best_before TIMESTAMPTZ NOT NULL,
    collection_deadline TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    storage_information TEXT,
    ingredients TEXT,
    allergens TEXT,
    is_vegetarian BOOLEAN DEFAULT TRUE,
    dietary_tags TEXT[] DEFAULT ARRAY['Veg']::TEXT[],
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PARTIALLY_SOLD', 'SOLD_OUT', 'RESCUE_PENDING', 'RESCUED', 'EXPIRED', 'CANCELLED')),
    urgency_level VARCHAR(50) DEFAULT 'NORMAL' CHECK (urgency_level IN ('NORMAL', 'ATTENTION', 'URGENT', 'EXPIRED')),
    city VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FOOD IMAGES
CREATE TABLE IF NOT EXISTS food_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES food_listings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS & ITEMS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES food_listings(id) ON DELETE RESTRICT,
    consumer_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    provider_id UUID REFERENCES providers(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    pickup_code VARCHAR(50) NOT NULL UNIQUE,
    pickup_pin VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'READY_FOR_PICKUP' CHECK (status IN ('ORDER_PLACED', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    pickup_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES food_listings(id) ON DELETE RESTRICT,
    quantity INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INVENTORY
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    reorder_level NUMERIC(10, 2) DEFAULT 5,
    status VARCHAR(50) DEFAULT 'NORMAL' CHECK (status IN ('NORMAL', 'LOW_STOCK', 'OUT_OF_STOCK')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. RESCUE REQUESTS & ASSIGNMENTS
CREATE TABLE IF NOT EXISTS rescue_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES food_listings(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    trigger_reason TEXT,
    deadline TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'PICKUP_ASSIGNED', 'EN_ROUTE', 'PICKED_UP', 'RECEIVED', 'COMPLETED', 'REJECTED', 'CANCELLED')),
    rescue_partner_id UUID REFERENCES rescue_partners(id) ON DELETE SET NULL,
    accepted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rescue_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rescue_request_id UUID REFERENCES rescue_requests(id) ON DELETE CASCADE,
    volunteer_name VARCHAR(255),
    vehicle_info VARCHAR(255),
    dispatched_at TIMESTAMPTZ,
    arrived_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 10. REVIEWS & FAVORITES
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES food_listings(id) ON DELETE CASCADE,
    consumer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES food_listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reference_id VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. COMPLAINTS & MESSAGES
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(100) PRIMARY KEY, -- FW-CMP-YYYYMMDD-XXXX
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    listing_id UUID REFERENCES food_listings(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    assigned_to VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaint_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id VARCHAR(100) REFERENCES complaints(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    sender_role VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_internal_note BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. QR CLAIMS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS qr_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(255) UNIQUE NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    verified_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'VERIFIED'
);

CREATE TABLE IF NOT EXISTS prediction_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    input_features JSONB NOT NULL,
    predicted_demand NUMERIC(10, 2),
    suggested_price NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    target_entity VARCHAR(100) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR MAXIMUM QUERY SPEED
CREATE INDEX IF NOT EXISTS idx_food_listings_city_area ON food_listings(city, area);
CREATE INDEX IF NOT EXISTS idx_food_listings_status_urgency ON food_listings(status, urgency_level);
CREATE INDEX IF NOT EXISTS idx_orders_consumer ON orders(consumer_id);
CREATE INDEX IF NOT EXISTS idx_orders_provider ON orders(provider_id);
CREATE INDEX IF NOT EXISTS idx_rescue_requests_status ON rescue_requests(status);
CREATE INDEX IF NOT EXISTS idx_complaints_status_priority ON complaints(status, priority);

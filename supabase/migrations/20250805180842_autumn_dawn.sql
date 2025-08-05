/*
  # Initial Database Schema for Local Services App

  1. New Tables
    - `profiles` 
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `phone` (text)
      - `user_type` (enum: client, provider)
      - `avatar_url` (text)
      - `location` (json)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `services`
      - `id` (uuid, primary key)
      - `provider_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `price` (decimal)
      - `duration_minutes` (integer)
      - `image_url` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)

    - `bookings`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references profiles)
      - `service_id` (uuid, references services)
      - `provider_id` (uuid, references profiles)
      - `scheduled_date` (date)
      - `scheduled_time` (time)
      - `status` (enum: pending, confirmed, completed, cancelled)
      - `notes` (text)
      - `created_at` (timestamp)

    - `messages`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, references bookings)
      - `sender_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamp)

    - `invoices`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, references bookings)
      - `provider_id` (uuid, references profiles)
      - `amount` (decimal)
      - `status` (enum: draft, sent, paid)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create custom types
CREATE TYPE user_type_enum AS ENUM ('client', 'provider');
CREATE TYPE booking_status_enum AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE invoice_status_enum AS ENUM ('draft', 'sent', 'paid');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  user_type user_type_enum NOT NULL DEFAULT 'client',
  avatar_url text,
  location json,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  price decimal(10,2) NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  status booking_status_enum DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  status invoice_status_enum DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Services policies
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Providers can manage own services"
  ON services FOR ALL
  TO authenticated
  USING (provider_id = auth.uid());

-- Bookings policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (client_id = auth.uid() OR provider_id = auth.uid());

CREATE POLICY "Clients can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid() OR provider_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view messages for their bookings"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = messages.booking_id 
      AND (bookings.client_id = auth.uid() OR bookings.provider_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages for their bookings"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = booking_id 
      AND (bookings.client_id = auth.uid() OR bookings.provider_id = auth.uid())
    )
  );

-- Invoices policies
CREATE POLICY "Users can view invoices for their bookings"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    provider_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = invoices.booking_id 
      AND bookings.client_id = auth.uid()
    )
  );

CREATE POLICY "Providers can manage invoices for their bookings"
  ON invoices FOR ALL
  TO authenticated
  USING (provider_id = auth.uid());
-- Create shipments table
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number TEXT UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Origin and destination
  origin_city TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  
  -- Package details
  packaging_type TEXT NOT NULL,
  package_count INTEGER NOT NULL DEFAULT 1,
  package_weight DECIMAL(10, 2) NOT NULL,
  weight_unit TEXT NOT NULL DEFAULT 'kg',
  
  -- Sender and recipient
  sender_name TEXT NOT NULL,
  sender_email TEXT,
  sender_phone TEXT,
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  recipient_phone TEXT,
  
  -- Pricing
  shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  insurance_cost DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  has_insurance BOOLEAN DEFAULT FALSE,
  
  -- Payment
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  
  -- Shipping option
  shipping_option TEXT,
  
  -- Dates
  pickup_date TIMESTAMPTZ,
  estimated_delivery_date TIMESTAMPTZ,
  actual_delivery_date TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shipment_status_history table for tracking history
CREATE TABLE IF NOT EXISTS public.shipment_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shipments
DROP POLICY IF EXISTS "Users can view their own shipments" ON public.shipments;
DROP POLICY IF EXISTS "Users can insert their own shipments" ON public.shipments;
DROP POLICY IF EXISTS "Users can update their own shipments" ON public.shipments;
DROP POLICY IF EXISTS "Anyone can view shipments by tracking number" ON public.shipments;

CREATE POLICY "Users can view their own shipments" ON public.shipments
  FOR SELECT USING (auth.uid() = user_id OR tracking_number IS NOT NULL);

CREATE POLICY "Users can insert their own shipments" ON public.shipments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shipments" ON public.shipments
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for shipment_status_history
DROP POLICY IF EXISTS "Anyone can view tracking history" ON public.shipment_status_history;
DROP POLICY IF EXISTS "System can insert tracking updates" ON public.shipment_status_history;

CREATE POLICY "Anyone can view tracking history" ON public.shipment_status_history
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert tracking updates" ON public.shipment_status_history
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to generate tracking number
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := 'ANT-';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate tracking number
CREATE OR REPLACE FUNCTION set_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_number IS NULL OR NEW.tracking_number = '' THEN
    NEW.tracking_number := generate_tracking_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_tracking_number ON public.shipments;
CREATE TRIGGER trigger_set_tracking_number
  BEFORE INSERT ON public.shipments
  FOR EACH ROW
  EXECUTE FUNCTION set_tracking_number();

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_shipments_updated_at ON public.shipments;
CREATE TRIGGER trigger_update_shipments_updated_at
  BEFORE UPDATE ON public.shipments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

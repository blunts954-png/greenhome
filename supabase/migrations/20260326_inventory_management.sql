-- Create the inventory table to track stock status by slug
CREATE TABLE IF NOT EXISTS inventory_status (
  slug TEXT PRIMARY KEY,
  is_out_of_stock BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Security)
ALTER TABLE inventory_status ENABLE ROW LEVEL SECURITY;

-- Allow service role (admin) all access
CREATE POLICY "Admin Service Role Full Access" ON inventory_status
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow public read access (for the shop frontend)
CREATE POLICY "Public Read Access" ON inventory_status
  FOR SELECT
  USING (true);

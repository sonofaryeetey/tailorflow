-- Create clients table
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL
);

-- Create items table
CREATE TABLE items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  waist TEXT,
  sleeve TEXT,
  leg_length TEXT,
  hip TEXT,
  thigh TEXT,
  extra_details TEXT,
  image_url TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policies (open access for MVP/demo, restrict in production)
CREATE POLICY "Enable read access for all users" ON clients FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON clients FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON clients FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON items FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON items FOR INSERT WITH CHECK (true);

-- NEW: Enable update access for edit feature
CREATE POLICY "Enable update access for all users" ON items FOR UPDATE USING (true);

-- NEW: Enable delete access for delete feature
CREATE POLICY "Enable delete access for all users" ON items FOR DELETE USING (true);

-- STORAGE SETUP
-- Note: You might need to create the 'item-images' bucket manually in the dashboard checking "Public", 
-- but running this might work if you have permissions.

-- 1. Policies for Storage Objects (Uploaded files)
-- We need to check if RLS is enabled on storage.objects, usually it is by default in Supabase.

CREATE POLICY "Give anon users access to images" ON storage.objects
  FOR SELECT USING ( bucket_id = 'item-images' );

CREATE POLICY "Give anon users upload access" ON storage.objects
  FOR INSERT WITH CHECK ( bucket_id = 'item-images' );

CREATE POLICY "Give anon users update access" ON storage.objects
  FOR UPDATE USING ( bucket_id = 'item-images' );

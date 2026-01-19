-- Clean up and replace items table columns with the new 25-field set
ALTER TABLE items 
-- Remove columns not in the new list
DROP COLUMN IF EXISTS sleeve,
DROP COLUMN IF EXISTS leg_length,
DROP COLUMN IF EXISTS thigh;

-- Add new columns (waist and hip already exist, keep them)
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS bust TEXT,
ADD COLUMN IF NOT EXISTS chest TEXT,
ADD COLUMN IF NOT EXISTS skirt_waist TEXT,
ADD COLUMN IF NOT EXISTS sleeve_length TEXT,
ADD COLUMN IF NOT EXISTS sleeve_width TEXT,
ADD COLUMN IF NOT EXISTS shirt_length TEXT,
ADD COLUMN IF NOT EXISTS blouse_length TEXT,
ADD COLUMN IF NOT EXISTS skirt_length TEXT,
ADD COLUMN IF NOT EXISTS trouser_waist TEXT,
ADD COLUMN IF NOT EXISTS trouser_length TEXT,
ADD COLUMN IF NOT EXISTS shorts_length TEXT,
ADD COLUMN IF NOT EXISTS jacket_length TEXT,
ADD COLUMN IF NOT EXISTS kaftan_dress_length TEXT,
ADD COLUMN IF NOT EXISTS dress TEXT,
ADD COLUMN IF NOT EXISTS jumpsuit TEXT,
ADD COLUMN IF NOT EXISTS seat TEXT,
ADD COLUMN IF NOT EXISTS crotch TEXT,
ADD COLUMN IF NOT EXISTS shoulder TEXT,
ADD COLUMN IF NOT EXISTS arm_hole TEXT,
ADD COLUMN IF NOT EXISTS collar TEXT,
ADD COLUMN IF NOT EXISTS neckline TEXT,
ADD COLUMN IF NOT EXISTS bottom TEXT,
ADD COLUMN IF NOT EXISTS cuff TEXT;

-- Verify the final column set:
-- id, created_at, client_id, image_url, extra_details, 
-- waist, hip, bust, chest, skirt_waist, sleeve_length, sleeve_width, shirt_length, 
-- blouse_length, skirt_length, trouser_waist, trouser_length, shorts_length, 
-- jacket_length, kaftan_dress_length, dress, jumpsuit, seat, crotch, shoulder, 
-- arm_hole, collar, neckline, bottom, cuff

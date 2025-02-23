
-- Update user role to admin
UPDATE profiles 
SET role = 'admin'
WHERE email = 'aliecohen@gmail.com';

-- Ensure proper role type exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'superadmin');
    END IF;
END $$;

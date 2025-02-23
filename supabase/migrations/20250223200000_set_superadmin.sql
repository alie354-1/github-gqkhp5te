
-- Set user as superadmin
UPDATE profiles
SET role = 'superadmin'
WHERE auth.email() = 'alie+1@jointhewheel.com';

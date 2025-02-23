
-- Set admin role for specific user
DO $$ 
BEGIN
  -- Update user role in profiles table
  UPDATE auth.users 
  SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', 'admin')
  WHERE email = 'aliecohen@gmail.com';

  -- Update profile role
  UPDATE profiles 
  SET role = 'admin'
  WHERE email = 'aliecohen@gmail.com';

  -- Grant necessary permissions
  ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
  
  DROP POLICY IF EXISTS "Allow full access to admins" ON profiles;
  CREATE POLICY "Allow full access to admins" ON profiles TO authenticated
    USING (
      (SELECT (raw_user_meta_data->>'role')::text = 'admin' 
       FROM auth.users 
       WHERE id = auth.uid())
    )
    WITH CHECK (
      (SELECT (raw_user_meta_data->>'role')::text = 'admin' 
       FROM auth.users 
       WHERE id = auth.uid())
    );
END $$;

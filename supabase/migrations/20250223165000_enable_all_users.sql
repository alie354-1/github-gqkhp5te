
-- Enable admin access for all users
UPDATE profiles
SET role = 'admin'
WHERE role != 'admin';

-- Ensure all new users get admin role by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    role,
    full_name,
    is_public,
    allows_messages,
    settings
  ) VALUES (
    new.id,
    new.email,
    'admin',
    new.raw_user_meta_data->>'full_name',
    true,
    true,
    jsonb_build_object(
      'notifications', jsonb_build_object(
        'email', true,
        'push', true
      ),
      'privacy', jsonb_build_object(
        'showProfile', true,
        'allowMessages', true
      )
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

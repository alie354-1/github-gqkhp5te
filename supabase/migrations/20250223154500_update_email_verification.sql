
BEGIN;

UPDATE auth.users 
SET email_confirmed_at = CURRENT_TIMESTAMP,
    raw_user_meta_data = jsonb_set(
      raw_user_meta_data,
      '{email_verified}',
      'true'
    )
WHERE email = 'alie+1@jointhewheel';

COMMIT;

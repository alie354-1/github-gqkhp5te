
-- Add index for feature flags lookup
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);


-- Insert default feature flags
INSERT INTO app_settings (key, value)
VALUES ('feature_flags', '{
  "ideaHub": {"enabled": true, "visible": true},
  "community": {"enabled": true, "visible": true},
  "messages": {"enabled": true, "visible": true},
  "directory": {"enabled": true, "visible": true},
  "library": {"enabled": true, "visible": true},
  "marketplace": {"enabled": true, "visible": true},
  "legalHub": {"enabled": true, "visible": true},
  "devHub": {"enabled": true, "visible": true},
  "utilities": {"enabled": true, "visible": true},
  "financeHub": {"enabled": true, "visible": true},
  "adminPanel": {"enabled": true, "visible": true},
  "aiCofounder": {"enabled": true, "visible": true},
  "marketResearch": {"enabled": true, "visible": true},
  "pitchDeck": {"enabled": true, "visible": true},
  "documentStore": {"enabled": true, "visible": true},
  "teamManagement": {"enabled": true, "visible": true}
}'::jsonb)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;

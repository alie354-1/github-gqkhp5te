CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

INSERT INTO app_settings (key, value)
VALUES ('feature_flags', '{
  "ideaHub": {"enabled": true, "visible": true},
  "community": {"enabled": true, "visible": true},
  "messages": {"enabled": true, "visible": true}
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
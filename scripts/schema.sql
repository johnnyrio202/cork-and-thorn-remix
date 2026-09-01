-- Cork & Thorn — checked-in schema. Existing tables (staff_users, bookings)
-- were created ad hoc directly against the live DB before this file existed;
-- they're documented here for reference but this script only creates the new
-- content-CMS tables. Safe to re-run — every statement is idempotent.

-- Existing (reference only — do not re-run against a DB that already has these):
-- CREATE TABLE staff_users (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   name text NOT NULL,
--   email text UNIQUE NOT NULL,
--   password_hash text NOT NULL,
--   created_at timestamptz NOT NULL DEFAULT now()
-- );
-- CREATE TABLE bookings (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   booth_id text NOT NULL,
--   tier_id text,
--   reservation_date date NOT NULL,
--   arrival_time text NOT NULL,
--   party_size int NOT NULL,
--   guest_name text NOT NULL,
--   guest_phone text NOT NULL,
--   guest_email text NOT NULL,
--   promoter_code text,
--   deposit_amount_cents int,
--   notes text,
--   status text NOT NULL DEFAULT 'confirmed',
--   created_at timestamptz NOT NULL DEFAULT now()
-- );

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  date date NOT NULL,
  day text NOT NULL,
  time text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  artist text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS events_date_idx ON events (date);

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS gallery_images_sort_idx ON gallery_images (sort_order);

-- Campaign engine: subscriber lists + campaigns fanned out across
-- website / email / sms, plus a per-recipient SMS send queue (email bulk
-- sends are tracked by Resend's own Audience/Broadcast objects instead).
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text UNIQUE,
  name text,
  email_opt_in boolean NOT NULL DEFAULT true,
  sms_opt_in boolean NOT NULL DEFAULT true,
  source text NOT NULL DEFAULT 'manual',
  unsubscribed_email_at timestamptz,
  unsubscribed_sms_at timestamptz,
  resend_contact_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscribers_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  scheduled_at timestamptz,
  created_by uuid REFERENCES staff_users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campaign_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  channel text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  subject text,
  body text NOT NULL DEFAULT '',
  image_url text,
  news_post_id uuid REFERENCES news(id),
  sent_at timestamptz,
  UNIQUE (campaign_id, channel)
);

CREATE TABLE IF NOT EXISTS campaign_sms_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  subscriber_id uuid NOT NULL REFERENCES subscribers(id),
  status text NOT NULL DEFAULT 'queued',
  provider_message_id text,
  error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_sms_sends_queue_idx
  ON campaign_sms_sends (status) WHERE status = 'queued';

create table users (
  id serial primary key,
  email text unique not null,
  name text,
  tz text not null default 'Africa/Gaborone',
  created_at timestamptz not null default now()
);

create table recipients (
  id serial primary key,
  user_id int references users(id) on delete cascade,
  email text not null,
  display_name text,
  tz text not null default 'Africa/Gaborone',
  status text not null default 'active'
);

create table packages (
  id serial primary key,
  code text unique not null,         -- 'DAILY', 'WEEKLY'
  name text not null,
  cadence text not null,             -- 'daily' | 'weekly'
  price numeric(12,2) default 0,
  active boolean not null default true
);

create table subscriptions (
  id serial primary key,
  user_id int references users(id) on delete cascade,
  recipient_id int references recipients(id) on delete cascade,
  package_id int references packages(id),
  channel text not null default 'email', -- future: 'sms'
  send_time_local time not null default '07:00',
  status text not null default 'active',
  next_run_at_utc timestamptz,
  billing_mode text not null default 'self'
);

create table verses (
  id serial primary key,
  reference text not null,
  text text not null,
  language text not null default 'EN',
  theme text,
  length_chars int
);

create table send_jobs (
  id serial primary key,
  subscription_id int references subscriptions(id) on delete cascade,
  verse_id int references verses(id),
  run_at_utc timestamptz not null,
  status text not null default 'queued',
  attempts int not null default 0,
  last_error text
);

create table message_log (
  id serial primary key,
  channel text not null,                   -- 'email'|'sms'
  to_address text not null,
  subject text,
  provider_msg_id text,
  status text not null default 'sent',     -- 'sent'|'failed'
  sent_at timestamptz not null default now(),
  opened_at timestamptz,
  clicked_at timestamptz,
  complaint_at timestamptz,
  bounce_reason text
);

create table magic_links (
  token text primary key,
  email text not null,
  created_at timestamptz not null default now(),
  consumed_at timestamptz
);

create table unsub_tokens (
  token text primary key,
  recipient_id int references recipients(id) on delete cascade,
  channel text not null default 'email',
  created_at timestamptz not null default now()
);

-- helpful indexes
create index on subscriptions (next_run_at_utc, status);
create index on message_log (to_address, sent_at);

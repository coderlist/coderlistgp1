
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users (
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  last_succesful_login timestamp,
  last_failed_login timestamp,
  failed_login_attempts int ,
  first_name text NOT NULL,
  last_name text NOT NULL,
  PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS pages (
  page_id serial,
  created_by citext REFERENCES users(email) ON DELETE CASCADE, 
  page_created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW(),
  page_title text,
  url  text ,
  content text,
  PRIMARY KEY (page_Id)
);


CREATE TABLE IF NOT EXISTS session (
  sid varchar NOT NULL COLLATE "default",
	sess json NOT NULL,
	expire timestamp(6) NOT NULL,
  PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE
)
WITH (OIDS=FALSE);




CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_At = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp') THEN
        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON pages
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();
  END IF;
END
$$;



/* CREATE EXTENSION IF NOT EXISTS citext; */

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
  created_by text REFERENCES users(email) ON DELETE CASCADE, 
  page_created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW(),
  page_title text,
  url  text ,
  content text,
  PRIMARY KEY (page_Id)
);


CREATE TABLE IF NOT EXISTS user_sessions (
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


ALTER TABLE users ADD COLUMN IF NOT EXISTS active boolean DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS activation_token text,
  ADD COLUMN IF NOT EXISTS user_id serial;

DO $$
BEGIN
    IF NOT EXISTS ( SELECT  conname
                FROM    pg_constraint 
                WHERE   conname = 'not_empty_string')
    THEN
        ALTER TABLE users ADD CONSTRAINT not_empty_string CHECK (email <> '');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS ( SELECT  conname
                FROM    pg_constraint 
                WHERE   conname = 'not_undefined')
    THEN
        ALTER TABLE users ADD CONSTRAINT not_undefined CHECK (email <>'undefined');
    END IF;
END$$;
-- create table users
CREATE TABLE IF NOT EXISTS users (
  email TEXT NOT NULL UNIQUE, 
  password TEXT NOT NULL,
  last_succesful_login TIMESTAMP,
  last_failed_login TIMESTAMP,
  failed_login INT ,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  activated BOOLEAN DEFAULT FALSE,
  temporary_token TEXT,
  temporary_token_date TIMESTAMP,
  old_email TEXT[],
  creation_date TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  forgot_password_token TEXT,
  forgot_password_token_date TIMESTAMP,
  PRIMARY KEY (email)
);


-- create table pages 
CREATE TABLE IF NOT EXISTS pages (
  page_id SERIAL,
  created_by TEXT REFERENCES users(email) ON DELETE CASCADE, 
  creation_date TIMESTAMP DEFAULT NOW(),
  owner_id SERIAL REFERENCES users(user_id) ON DELETE CASCADE,
  title TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  is_homepage_grid BOOLEAN,
  is_nav_menu BOOLEAN,
  last_edited_date jSON
  PRIMARY KEY (page_Id)
);


-- creates tables user_sessions 
CREATE TABLE IF NOT EXISTS user_sessions (
  sid VARCHAR NOT NULL COLLATE "default",
	sess json NOT NULL,
	expire TIMESTAMP(6) NOT NULL,
  PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE
)
WITH (OIDS=FALSE);



/* 
creates a function to the time a page
was edited 
*/

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_edited_date = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/*
sets a trigger for update action time
*/

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

/*
a function to check for a non-empty
input value
*/

DO $$
BEGIN
    IF NOT EXISTS ( SELECT  conname
                FROM    pg_constraint 
                WHERE   conname = 'not_empty_string')
    THEN
        ALTER TABLE users ADD CONSTRAINT not_empty_string CHECK (email <> '');
    END IF;
END$$;

/*
a function to check for 'undefined'
input value
*/

DO $$
BEGIN
    IF NOT EXISTS ( SELECT  conname
                FROM    pg_constraint 
                WHERE   conname = 'not_undefined')
    THEN
        ALTER TABLE users ADD CONSTRAINT not_undefined CHECK (email <>'undefined');
    END IF;
END$$;
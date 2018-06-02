-- create table users
CREATE TABLE IF NOT EXISTS users (
  email text NOT NULL UNIQUE, 
  password text NOT NULL,
  last_succesful_login timestamp,
  last_failed_login timestamp,
  failed_login int ,
  first_name text NOT NULL,
  last_name text NOT NULL,
  activated BOOLEAN DEFAULT FALSE,
  temporary_token TEXT,
  temporary_token_date TIMESTAMP,
  old_email,
  creation_date TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  forgot_password_token text,
  forgot_password_token_date TIMESTAMP,
  PRIMARY KEY (email)
);


-- create table pages 
CREATE TABLE IF NOT EXISTS pages (
  page_id serial,
  created_by text REFERENCES users(email) ON DELETE CASCADE, 
  creation_date TIMESTAMP DEFAULT NOW(),
  owner_id serial REFERENCES users(user_id) ON DELETE CASCADE,
  title text,
  is_published BOOLEAN DEFAULT FALSE,
  is_homepage_grid BOOLEAN,
  is_nav_menu BOOLEAN,
  last_edited_date JSON
  PRIMARY KEY (page_Id)
);


-- creates tables user_sessions 
CREATE TABLE IF NOT EXISTS user_sessions (
  sid varchar NOT NULL COLLATE "default",
	sess json NOT NULL,
	expire timestamp(6) NOT NULL,
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
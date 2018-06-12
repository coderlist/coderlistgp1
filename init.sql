CREATE TABLE IF NOT EXISTS users (
  user_id serial UNIQUE,  
  email TEXT NOT NULL UNIQUE, 
  password TEXT,
  last_succesful_login TIMESTAMP,
  last_failed_login TIMESTAMP,
  failed_login_attempts INT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  activated BOOLEAN DEFAULT FALSE,
  temporary_token TEXT,
  temporary_token_date TIMESTAMP,
  creation_date TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  old_email TEXT[],   --- {"email":"","token_date":"","token":""}
  forgot_password_token TEXT,
  forgot_password_token_date TIMESTAMP,
  PRIMARY KEY (email)
);


-- create table pages 
CREATE TABLE IF NOT EXISTS pages (
  page_id SERIAL,
  created_by TEXT  REFERENCES users(email) ON DELETE CASCADE, 
  creation_date TIMESTAMP DEFAULT NOW(),
  owner_id SERIAL REFERENCES users(user_id) ON DELETE CASCADE,  
  title json,    
  is_published BOOLEAN DEFAULT FALSE,
  is_homepage_grid BOOLEAN,
  is_nav_menu BOOLEAN,
  last_edited_date jSON, 
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


ALTER TABLE users DROP COLUMN IF EXISTS active;

ALTER TABLE users DROP COLUMN IF EXISTS activated;

ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

ALTER TABLE pages ALTER COLUMN title SET DATA TYPE TEXT;

ALTER TABLE users ADD COLUMN IF NOT EXISTS activation_token TEXT,
  ADD COLUMN IF NOT EXISTS user_id serial,
  ADD COLUMN IF NOT EXISTS old_pasword json[];  --- {"password":"","token_date":"","change_token":""}

ALTER TABLE pages ADD COLUMN IF NOT EXISTS ckeditor_html TEXT;
ALTER TABLE pages DROP COLUMN IF EXISTS owner_id;
ALTER TABLE pages ALTER COLUMN title SET NOT NULL;


 -- adds constraint to email column does
 --  not recieve empty string

DO $$
BEGIN
    IF NOT EXISTS ( SELECT  conname
                FROM    pg_constraint 
                WHERE   conname = 'not_empty_string')
    THEN
        ALTER TABLE users ADD CONSTRAINT not_empty_string CHECK (email <> '');
    END IF;
END$$;

--  add constraint to email column not to
--  receive undefined

DO $$
BEGIN
    IF NOT EXISTS ( SELECT  conname
                FROM    pg_constraint 
                WHERE   conname = 'not_undefined')
    THEN
        ALTER TABLE users ADD CONSTRAINT not_undefined CHECK (email <>'undefined');
    END IF;
END$$;

-- converts text array to json array

DO $$
BEGIN
  IF ( select udt_name from information_schema.columns 
      where table_name = 'users' and column_name='old_email') = '_text'
  THEN
     ALTER TABLE users DROP COLUMN old_email;
     ALTER TABLE users ADD COLUMN old_email json[];
  END IF;
END $$;



-- drops json datatype from last_edited_date column
-- and cast it to timestamp without zone

DO $$
BEGIN 
    IF EXISTS (select 1 from information_schema.columns 
        where table_name = 'pages' and 
        column_name = 'last_edited_date' and data_type = 'json')
    THEN 
       ALTER TABLE pages DROP COLUMN last_edited_date;
       ALTER TABLE pages ADD COLUMN last_edited_date TIMESTAMP;
    END IF;
END
$$;

-- creates a function to the time a page
-- was edited 


CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_edited_date = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- sets a trigger for update action time


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

-- alter foreign constraint on pages

DO $$
BEGIN
  IF ( select confdeltype from pg_constraint 
      where conname = 'pages_created_by_fkey') = 'c'
  THEN
     ALTER TABLE pages DROP CONSTRAINT pages_created_by_fkey;
     ALTER TABLE pages ADD CONSTRAINT pages_created_by_fkey FOREIGN KEY 
     (created_by) REFERENCES users(email) ON DELETE SET NULL;
  END IF;
END $$;


              
        


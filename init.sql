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
  creation_date TIMESTAMP ,
  verified BOOLEAN DEFAULT FALSE,
  old_email TEXT[],   --- {"email":"","token_date":"","token":""}
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
  title JSON,    
  is_published BOOLEAN DEFAULT FALSE,
  is_homepage_grid BOOLEAN,
  is_nav_menu BOOLEAN,
  last_edited_date JSON, 
  PRIMARY KEY (page_Id)
);

-- craete table images
CREATE TABLE IF NOT EXISTS images (
 image_id SERIAL,
 image_name TEXT,
 created TIMESTAMP DEFAULT NOW(),
 location TEXT,
 page_id INTEGER REFERENCES pages(page_id) ON DELETE CASCADE,
 page_image BOOLEAN,
 banner_image BOOLEAN,
 uploaded_images BOOLEAN,
 PRIMARY KEY (image_id)  
);


CREATE TABLE IF NOT EXISTS navigations (
  page_id INTEGER REFERENCES pages(page_id) ON DELETE SET NULL,
  created_by TEXT,
  created TIMESTAMP DEFAULT NOW(),
  name TEXT,
  title TEXT,
  link TEXT,
  order_number INTEGER,
  content TEXT,
  navigation_id SERIAL,
  parent_navigation_id INTEGER REFERENCES navigations(navigation_id),
  PRIMARY KEY (navigation_id)
);

CREATE TABLE IF NOT EXISTS sub_navigations (
  sub_nav_id SERIAL,
  page_id INTEGER REFERENCES pages(page_id) ON DELETE SET NULL,
  created TIMESTAMP DEFAULT NOW(),
  name TEXT,
  link TEXT,
  grid_order_number INTEGER,
  content TEXT,
  parent_navigation_id INTEGER REFERENCES navigations(navigation_id),
  PRIMARY KEY (sub_nav_id)
);

CREATE TABLE IF NOT EXISTS call_to_actions (
  action_id SERIAL,
  decription TEXT,
  PRIMARY KEY (action_id)
);




-- creates tables user_sessions 
CREATE TABLE IF NOT EXISTS user_sessions (
  sid VARCHAR NOT NULL COLLATE "default",
	sess JSON NOT NULL,
	expire TIMESTAMP(6) NOT NULL,
  PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE
)
WITH (OIDS=FALSE);


ALTER TABLE users DROP COLUMN IF EXISTS active;

ALTER TABLE users DROP COLUMN IF EXISTS activated;

ALTER TABLE users DROP COLUMN IF EXISTS old_pasword;

ALTER TABLE pages DROP COLUMN IF EXISTS owner_id;

ALTER TABLE navigations DROP COLUMN IF EXISTS order_number;

ALTER TABLE navigations DROP COLUMN IF EXISTS parent_navigation_id;

ALTER TABLE navigations DROP COLUMN IF EXISTS grid_order_numer;

ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

ALTER TABLE call_to_actions DROP COLUMN IF EXISTS decription;

ALTER TABLE users ALTER COLUMN creation_date SET DEFAULT now();

ALTER TABLE pages ALTER COLUMN title SET DATA TYPE TEXT;

ALTER TABLE pages ALTER COLUMN is_nav_menu SET DEFAULT FALSE;

ALTER TABLE pages ALTER COLUMN is_homepage_grid SET DEFAULT FALSE;

ALTER TABLE images ALTER COLUMN page_image SET DEFAULT FALSE;

ALTER TABLE images ALTER COLUMN banner_image SET DEFAULT FALSE;

ALTER TABLE images ALTER COLUMN uploaded_images SET DEFAULT FALSE;



ALTER TABLE users ADD COLUMN IF NOT EXISTS activation_token TEXT,
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS old_password JSON[];  --- {"password":"","token_date":"","change_token":""}

ALTER TABLE users ALTER COLUMN is_admin SET DEFAULT TRUE;

ALTER TABLE pages ADD COLUMN IF NOT EXISTS ckeditor_html TEXT,
   ADD COLUMN IF NOT EXISTS order_number INTEGER,
   ADD COLUMN IF NOT EXISTS page_description TEXT,
   ADD COLUMN IF NOT EXISTS banner_location TEXT,
   ADD COLUMN IF NOT EXISTS last_edited_by TEXT;
 --  ADD COLUMN IF NOT EXISTS owner_id INT REFERENCES users(user_id) ON DELETE SET NULL;

<<<<<<< HEAD

=======
 ALTER TABLE call_to_actions ADD COLUMN IF NOT EXISTS created TIMESTAMP DEFAULT NOW();

ALTER TABLE call_to_actions ADD COLUMN IF NOT EXISTS description TEXT;
>>>>>>> 40820c191611c6a6717f07483c46503ecf345a36

--ALTER TABLE pages DROP COLUMN IF EXISTS owner_id;
ALTER TABLE pages ALTER COLUMN title SET NOT NULL;

ALTER TABLE navigations ADD COLUMN IF NOT EXISTS nav_order_number INTEGER;
--  ADD COLUMN IF NOT EXISTS grid_order_number INTEGER;

ALTER TABLE images DROP COLUMN IF EXISTS page_id;




DO $$
BEGIN
    IF NOT EXISTS ( SELECT  conname
                FROM    pg_constraint 
                WHERE   conname = 'nav_name_const')
    THEN
        ALTER TABLE navigations ADD CONSTRAINT nav_name_const UNIQUE (name);
    END IF;
END$$;

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
     ALTER TABLE users ADD COLUMN old_email JSON[];
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

------ alter pages foreign constraint on created_by

DO $$
BEGIN
  IF ( select udt_name from information_schema.columns 
  where table_name = 'pages' and column_name='created_by') = 'text'
  THEN
     ALTER TABLE pages DROP COLUMN created_by;
     ALTER TABLE pages ADD COLUMN created_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL;
  END IF;
END $$;










              
        


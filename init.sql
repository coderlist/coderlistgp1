
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users (
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  last_Succesful_Login timestamp,
  last_Failed_Login timestamp,
  failed_Login_Attempts int ,
  first_Name text NOT NULL,
  last_Name text NOT NULL,
  PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS pages (
  page_Id serial,
  created_By citext REFERENCES users(email) ON DELETE CASCADE, 
  page_Created_At timestamp DEFAULT NOW(),
  updated_At timestamp DEFAULT NOW(),
  page_Title text,
  url  text ,
  content text,
  PRIMARY KEY (page_Id)
);


CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;



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


CREATE EXTENSION  "uuid-ossp";
CREATE EXTENSION citext;



CREATE TABLE  users (
  user_Id uuid DEFAULT uuid_generate_v1mc(),
  username text UNIQUE,
  email citext NOT NULL UNIQUE,
  password text NOT NULL,
  last_Succesful_Login timestamp,
  last_Failed_Login timestamp,
  failed_Login_Attempts int ,
  first_Name text NOT NULL,
  last_Name text NOT NULL,
  PRIMARY KEY (user_Id)
);

CREATE TABLE pages (
  page_Id serial,
  updated_At timestamp DEFAULT NOW(),
  page_Title text,
  url  text ,
  created_By text REFERENCES users(username) ON DELETE CASCADE,
  page_Created timestamp DEFAULT NOW(),
  html_Body text,
  PRIMARY KEY (page_Id)
);




CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_At = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER  set_timestamp
BEFORE UPDATE ON pages
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


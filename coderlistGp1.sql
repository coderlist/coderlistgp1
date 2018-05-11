CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE  users (
  user_id uuid DEFAULT uuid_generate_v1mc(),
  username varchar(50),
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  last_Succesful_Login timestamp,
  last_Failed_Login timestamp,
  failed_Login_Attempts int ,
  first_name text NOT NULL,
  last_name text NOT NULL,
  PRIMARY KEY (user_Id)
);

CREATE TABLE pages (
  date_Published timestamp,
  page_Id serial,
  url  text,
  created_By varchar(50) REFERENCES users(user_Id) ON DELETE CASCADE,
  page_Created timestamp,
  PRIMARY KEY (page_Id)
);


CREATE TABLE Content (
  content_Description text,
  html_Body text,
  page_Id int REFERENCES pages(page_Id) ON DELETE CASCADE,
  PRIMARY KEY (content_Description)
);




CREATE TABLE users (
  username varchar(50),
  email varchar(50),
  password varchar(50),
  last_Succesful_Login timestamp,
  last_Failed_Login timestamp,
  failed_Login_Attempts int,
  first_name varchar(50),
  last_name varchar(50),
  PRIMARY KEY (username)
);

CREATE TABLE pages (
  date_Published timestamp,
  page_Id serial,
  url  text,
  created_By varchar(50) REFERENCES users(username) ON DELETE CASCADE,
  page_Created timestamp,
  PRIMARY KEY (page_Id)
);


CREATE TABLE Content (
  content_Description text,
  html_Body text,
  page_Id int REFERENCES pages(page_Id) ON DELETE CASCADE,
  PRIMARY KEY (content_Description)
);




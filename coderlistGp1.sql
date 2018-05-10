CREATE TABLE Users (
  username varchar(50),
  email varchar(50),
  password varchar(50),
  last_succesful_login timestamp,
  last_failed_login timestamp,
  failed_login_attemps int,
  firstName varchar(50),
  lastName varchar(50),
  PRIMARY KEY (username)
);

CREATE TABLE Pages (
  date_published timestamp,
  page_id serial UNIQUE,
  url  text,
  created_by varchar(50) REFERENCES Users(username) ON DELETE CASCADE,
  page_created timestamp,
  PRIMARY KEY (page_id)
);


CREATE TABLE Content (
  content_description text,
  html_body text,
  page_id int REFERENCES Pages(page_id) ON DELETE CASCADE,
  PRIMARY KEY (content_description)
);




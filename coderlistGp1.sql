CREATE TABLE "Pages" (
  "page_published" timestamp,
  "page_id" int,
  "url" text,
  "created_by" int,
  "page_created" timestamp,
  PRIMARY KEY ("page_id")
);

CREATE INDEX "FK" ON  "Pages" ("created_by");

CREATE INDEX "Key" ON  "Pages" ("page_created");

CREATE TABLE "Users" (
  "username" varchar(50),
  "email" varchar(50),
  "password" varchar(50),
  "last_succesful_login" datetime,
  "last_failed_login" timestamp,
  "failed_login_attemps" int,
  "firstName" varchar(50),
  "lastName" varchar(50),
  "user_id" int,
  PRIMARY KEY ("user_id")
);

CREATE TABLE "Content" (
  "content_Id" int,
  "html_body" text,
  "page_id" int,
  PRIMARY KEY ("content_Id")
);

CREATE INDEX "FK" ON  "Content" ("page_id");


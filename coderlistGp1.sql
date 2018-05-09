CREATE TABLE "User" (
  "username" varchar(50),
  "Email" varchar(50),
  "password" varchar(50),
  "LastSuccesfulLogin" timestamp,
  "LastFailedLogin" timestamp,
  "FailedLoginAttemps" int,
  "firstName" varchar(50),
  "lastName" varchar(50),
  "userId" int,
  PRIMARY KEY ("userId")
);

CREATE TABLE "Page" (
  "pagePublished" timestamp,
  "pageId" int,
  "url" text,
  "userId" int,
  "pageCreated" timestamp,
  PRIMARY KEY ("pageId")
);

CREATE INDEX "FK" ON  "Page" ("userId");

CREATE INDEX "Key" ON  "Page" ("pageCreated");

CREATE TABLE "content" (
  "contentId" int,
  "htmlBody" text,
  "pageId" int,
  PRIMARY KEY ("contentId")
);

CREATE INDEX "FK" ON  "content" ("pageId");


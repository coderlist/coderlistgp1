CREATE TABLE "User" (
  "username" varchar(50),
  "Email" varchar(50),
  "password" varchar(50),
  "LastSuccesfulLogin" datetime,
  "LastFailedLogin" datetime,
  "FailedLoginAttemps" int,
  "firstName" varchar(50),
  "lastName" varchar(50),
  "userId" int,
  PRIMARY KEY ("userId")
);

CREATE TABLE "Page" (
  "pagePublished" datetime,
  "pageId" int,
  "url" Type,
  "userId" int,
  "pageCreated" datetime,
  PRIMARY KEY ("pageId")
);

CREATE INDEX "FK" ON  "Page" ("userId");

CREATE INDEX "Key" ON  "Page" ("pageCreated");

CREATE TABLE "content" (
  "contentId" int,
  "htmlBody" Type,
  "pageId" int,
  PRIMARY KEY ("contentId")
);

CREATE INDEX "FK" ON  "content" ("pageId");


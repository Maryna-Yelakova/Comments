---- database
create database "comments-task";

--tables
create table "comments"(
  "id" serial primary key,
  "path" ltree,
  "name" varchar not null,
  "email" varchar not null,
  "date" timestamp,
  "baseurl" varchar,
  "comment" varchar not null,
  "ip" varchar,
  "browser" varchar
);


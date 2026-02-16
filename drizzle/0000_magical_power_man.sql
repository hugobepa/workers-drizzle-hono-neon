CREATE SCHEMA IF NOT EXISTS "drizzle";

CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"price" double precision
);

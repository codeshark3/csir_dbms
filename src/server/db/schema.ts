// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { time } from "console";
import { sql } from "drizzle-orm";
import { int } from "drizzle-orm/mysql-core";
import {
  index,
  text,
  boolean,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  serial,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `csir_dbms_${name}`);


export const user = createTable("user", {
  id: text("id").primaryKey(),
  name: varchar("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("banReason"),
  banExpires: integer("banExpires"),
});

export const session = createTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token"),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  impersonatedBy: text("impersonatedBy"),
});

export const account = createTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
  password: text("password"),
});

export const verification = createTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export const dataset = createTable("dataset", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  year: text("year").notNull(),
  pi_name: text("pi_name").notNull(),
  tags: text("tags"),
  papers: text("papers"),
  division: text("division").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  fileUrl: text("fileUrl"),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  user_id: text("user_id").references(() => user.id),
});

// Tags Table (Stores unique tag names)
export const tags = createTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Junction Table (Many-to-Many Relationship)
export const datasetTags = createTable("dataset_tags", {
  datasetId: integer("dataset_id")
    .notNull()
    .references(() => dataset.id),
  tagId: integer("tag_id")
    .notNull()
    .references(() => tags.id),
});

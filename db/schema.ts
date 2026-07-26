import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contentDocuments = sqliteTable("content_documents", {
  key: text("key").primaryKey(),
  body: text("body").notNull(),
  updatedAt: integer("updated_at").notNull(),
  updatedBy: text("updated_by").notNull(),
});

export const contentRevisions = sqliteTable("content_revisions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull(),
  body: text("body").notNull(),
  createdAt: integer("created_at").notNull(),
  createdBy: text("created_by").notNull(),
});

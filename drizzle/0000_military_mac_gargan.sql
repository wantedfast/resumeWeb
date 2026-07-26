CREATE TABLE `content_documents` (
	`key` text PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`updated_at` integer NOT NULL,
	`updated_by` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content_revisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL,
	`created_by` text NOT NULL
);

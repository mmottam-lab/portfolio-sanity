import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    boolean,
} from "drizzle-orm/pg-core";

// ─── Contact form submissions ───────────────────────────────────────
export const contacts = pgTable("contacts", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 255 }),
    message: text("message").notNull(),
    read: boolean("read").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── Newsletter subscribers ─────────────────────────────────────────
export const subscribers = pgTable("subscribers", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    active: boolean("active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ─── Page-view analytics ────────────────────────────────────────────
export const pageViews = pgTable("page_views", {
    id: uuid("id").primaryKey().defaultRandom(),
    path: varchar("path", { length: 500 }).notNull(),
    referrer: varchar("referrer", { length: 500 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

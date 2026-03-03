import type { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { pageViews } from "../db/schema.js";

export async function analyticsRoutes(app: FastifyInstance) {
    // POST /analytics/pageview — track a page view
    app.post<{
        Body: { path: string; referrer?: string; userAgent?: string };
    }>("/analytics/pageview", async (request, reply) => {
        const { path, referrer, userAgent } = request.body;

        if (!path) {
            return reply.status(400).send({ error: "path is required" });
        }

        const [created] = await db
            .insert(pageViews)
            .values({ path, referrer, userAgent })
            .returning();

        return reply.status(201).send(created);
    });

    // GET /analytics/pageviews — get page view stats summary
    app.get("/analytics/pageviews", async () => {
        const rows = await db.select().from(pageViews);

        // Simple aggregation by path
        const byPath: Record<string, number> = {};
        for (const row of rows) {
            byPath[row.path] = (byPath[row.path] || 0) + 1;
        }

        return {
            total: rows.length,
            byPath,
        };
    });
}

import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { healthRoutes } from "./routes/health.js";
import { contactRoutes } from "./routes/contacts.js";
import { subscriberRoutes } from "./routes/subscribers.js";
import { analyticsRoutes } from "./routes/analytics.js";

const app = Fastify({
    logger: {
        level: process.env.LOG_LEVEL || "info",
        transport:
            process.env.NODE_ENV !== "production"
                ? { target: "pino-pretty" }
                : undefined,
    },
});

// ─── Plugins ────────────────────────────────────────────────────────
await app.register(cors, {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
});

// ─── Routes ─────────────────────────────────────────────────────────
await app.register(healthRoutes);
await app.register(contactRoutes);
await app.register(subscriberRoutes);
await app.register(analyticsRoutes);

// ─── Start ──────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "0.0.0.0";

try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`🚀 API listening on http://${HOST}:${PORT}`);
} catch (err) {
    app.log.error(err);
    process.exit(1);
}

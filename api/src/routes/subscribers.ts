import type { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { subscribers } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function subscriberRoutes(app: FastifyInstance) {
    // POST /subscribers — subscribe to newsletter
    app.post<{ Body: { email: string } }>(
        "/subscribers",
        async (request, reply) => {
            const { email } = request.body;

            if (!email) {
                return reply.status(400).send({ error: "email is required" });
            }

            try {
                const [created] = await db
                    .insert(subscribers)
                    .values({ email })
                    .onConflictDoNothing()
                    .returning();

                if (!created) {
                    return reply.status(200).send({ message: "Already subscribed" });
                }

                return reply.status(201).send(created);
            } catch {
                return reply.status(500).send({ error: "Failed to subscribe" });
            }
        }
    );

    // DELETE /subscribers/:email — unsubscribe
    app.delete<{ Params: { email: string } }>(
        "/subscribers/:email",
        async (request, reply) => {
            const { email } = request.params;
            const [updated] = await db
                .update(subscribers)
                .set({ active: false })
                .where(eq(subscribers.email, email))
                .returning();

            if (!updated) {
                return reply.status(404).send({ error: "Not found" });
            }

            return { success: true };
        }
    );
}

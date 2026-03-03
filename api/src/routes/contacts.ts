import type { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { contacts } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

export async function contactRoutes(app: FastifyInstance) {
    // POST /contacts — create a new contact submission
    app.post<{
        Body: { name: string; email: string; subject?: string; message: string };
    }>("/contacts", async (request, reply) => {
        const { name, email, subject, message } = request.body;

        if (!name || !email || !message) {
            return reply
                .status(400)
                .send({ error: "name, email, and message are required" });
        }

        const [created] = await db
            .insert(contacts)
            .values({ name, email, subject, message })
            .returning();

        return reply.status(201).send(created);
    });

    // GET /contacts — list all contact submissions
    app.get("/contacts", async () => {
        return db.select().from(contacts).orderBy(desc(contacts.createdAt));
    });

    // GET /contacts/:id — get a single contact
    app.get<{ Params: { id: string } }>("/contacts/:id", async (request, reply) => {
        const { id } = request.params;
        const [contact] = await db
            .select()
            .from(contacts)
            .where(eq(contacts.id, id));

        if (!contact) {
            return reply.status(404).send({ error: "Not found" });
        }

        return contact;
    });

    // PATCH /contacts/:id/read — mark as read
    app.patch<{ Params: { id: string } }>(
        "/contacts/:id/read",
        async (request, reply) => {
            const { id } = request.params;
            const [updated] = await db
                .update(contacts)
                .set({ read: true })
                .where(eq(contacts.id, id))
                .returning();

            if (!updated) {
                return reply.status(404).send({ error: "Not found" });
            }

            return updated;
        }
    );

    // DELETE /contacts/:id
    app.delete<{ Params: { id: string } }>(
        "/contacts/:id",
        async (request, reply) => {
            const { id } = request.params;
            const [deleted] = await db
                .delete(contacts)
                .where(eq(contacts.id, id))
                .returning();

            if (!deleted) {
                return reply.status(404).send({ error: "Not found" });
            }

            return { success: true };
        }
    );
}

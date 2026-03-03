import { defineField, defineType } from "sanity";

export default defineType({
    name: "subcategory",
    title: "Subcategoría",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Título",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title", maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Descripción",
            type: "text",
            rows: 4,
        }),
        defineField({
            name: "initiative",
            title: "Iniciativa",
            type: "reference",
            to: [{ type: "initiative" }],
            validation: (Rule) => Rule.required(),
            description: "La iniciativa a la que pertenece esta subcategoría.",
        }),
        defineField({
            name: "icon",
            title: "Icono (emoji)",
            type: "string",
            description: "Un emoji para representar visualmente esta subcategoría (ej: 🎓, 🤖, 📊).",
        }),
        defineField({
            name: "order",
            title: "Orden",
            type: "number",
            description: "Orden de aparición (menor = primero).",
            initialValue: 0,
        }),
    ],
    orderings: [
        {
            title: "Orden",
            name: "orderAsc",
            by: [{ field: "order", direction: "asc" }],
        },
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "initiative.title",
            icon: "icon",
        },
        prepare({ title, subtitle, icon }) {
            return {
                title: `${icon || "📁"} ${title}`,
                subtitle: `Iniciativa: ${subtitle || "—"}`,
            };
        },
    },
});

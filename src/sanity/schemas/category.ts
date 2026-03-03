import { defineField, defineType } from "sanity";

export default defineType({
    name: "category",
    title: "Categoría",
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
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Descripción",
            type: "text",
            rows: 2,
        }),
        defineField({
            name: "color",
            title: "Color (hex)",
            type: "string",
            description: "Color para la etiqueta, ej: #6366f1",
        }),
    ],
});

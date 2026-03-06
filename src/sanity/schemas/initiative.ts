import { defineField, defineType } from "sanity";

export default defineType({
    name: "initiative",
    title: "Iniciativa",
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
            title: "Descripción corta",
            type: "text",
            rows: 3,
        }),
        defineField({
            name: "mainImage",
            title: "Imagen principal",
            type: "image",
            options: { hotspot: true },
        }),
        defineField({
            name: "body",
            title: "Documentación / Contenido",
            type: "array",
            of: [
                {
                    type: "block",
                    styles: [
                        { title: "Normal", value: "normal" },
                        { title: "H2", value: "h2" },
                        { title: "H3", value: "h3" },
                        { title: "H4", value: "h4" },
                        { title: "Quote", value: "blockquote" },
                    ],
                    marks: {
                        decorators: [
                            { title: "Bold", value: "strong" },
                            { title: "Italic", value: "em" },
                            { title: "Code", value: "code" },
                        ],
                        annotations: [
                            {
                                title: "URL",
                                name: "link",
                                type: "object",
                                fields: [{ title: "URL", name: "href", type: "url" }],
                            },
                        ],
                    },
                },
                { type: "image", options: { hotspot: true } },
                { type: "code", title: "Code Block" },
                {
                    type: "file",
                    title: "Documento PDF",
                    options: { accept: ".pdf" },
                    fields: [
                        {
                            name: "description",
                            title: "Descripción del documento",
                            type: "string",
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: "status",
            title: "Estado",
            type: "string",
            options: {
                list: [
                    { title: "Activa", value: "active" },
                    { title: "Completada", value: "completed" },
                    { title: "Planeada", value: "planned" },
                ],
                layout: "radio",
            },
            initialValue: "active",
        }),
        defineField({
            name: "objectives",
            title: "Objetivos",
            type: "array",
            of: [{ type: "string" }],
        }),
        defineField({
            name: "technologies",
            title: "Tecnologías",
            type: "array",
            of: [{ type: "string" }],
            options: { layout: "tags" },
        }),
        defineField({
            name: "category",
            title: "Categoría",
            type: "reference",
            to: [{ type: "category" }],
        }),
        defineField({
            name: "featured",
            title: "Destacada",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "publishedAt",
            title: "Fecha de publicación",
            type: "datetime",
        }),
    ],
    orderings: [
        {
            title: "Fecha (desc)",
            name: "publishedAtDesc",
            by: [{ field: "publishedAt", direction: "desc" }],
        },
    ],
    preview: {
        select: { title: "title", media: "mainImage", subtitle: "status" },
    },
});

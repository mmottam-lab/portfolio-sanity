import { defineField, defineType } from "sanity";

export default defineType({
    name: "project",
    title: "Proyecto",
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
            name: "subcategory",
            title: "Subcategoría",
            type: "reference",
            to: [{ type: "subcategory" }],
            validation: (Rule) => Rule.required(),
            description: "La subcategoría a la que pertenece este proyecto.",
        }),
        defineField({
            name: "mainImage",
            title: "Imagen principal",
            type: "image",
            options: { hotspot: true },
        }),
        defineField({
            name: "video",
            title: "Video principal",
            type: "file",
            options: { accept: "video/*" },
            description: "Sube un archivo de video directamente (MP4, MOV, WebM, etc.).",
        }),
        defineField({
            name: "videoUrl",
            title: "URL de video externo",
            type: "url",
            description: "Enlace a un video de YouTube o Vimeo (se mostrará como embed).",
        }),
        defineField({
            name: "body",
            title: "Contenido / Documentación",
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
                {
                    type: "object",
                    name: "video",
                    title: "Video",
                    fields: [
                        {
                            name: "file",
                            title: "Archivo de video",
                            type: "file",
                            options: { accept: "video/*" },
                        },
                        {
                            name: "url",
                            title: "URL de video externo",
                            type: "url",
                            description: "YouTube o Vimeo URL.",
                        },
                        {
                            name: "caption",
                            title: "Descripción",
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
                    { title: "Activo", value: "active" },
                    { title: "Completado", value: "completed" },
                    { title: "En pausa", value: "paused" },
                    { title: "Planeado", value: "planned" },
                ],
                layout: "radio",
            },
            initialValue: "active",
        }),
        defineField({
            name: "url",
            title: "URL del proyecto",
            type: "url",
            description: "Enlace externo al proyecto (si aplica).",
        }),
        defineField({
            name: "technologies",
            title: "Tecnologías",
            type: "array",
            of: [{ type: "string" }],
            options: { layout: "tags" },
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
            subtitle: "subcategory.title",
            media: "mainImage",
            status: "status",
        },
        prepare({ title, subtitle, media, status }) {
            const emoji: Record<string, string> = {
                active: "🟢",
                completed: "✅",
                paused: "⏸️",
                planned: "📋",
            };
            return {
                title: `${emoji[status] || ""} ${title}`,
                subtitle: `Subcategoría: ${subtitle || "—"}`,
                media,
            };
        },
    },
});

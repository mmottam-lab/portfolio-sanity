import { defineField, defineType } from "sanity";

export default defineType({
    name: "case",
    title: "Caso",
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
            title: "Contenido del caso",
            type: "array",
            of: [
                {
                    type: "block",
                    styles: [
                        { title: "Normal", value: "normal" },
                        { title: "H2", value: "h2" },
                        { title: "H3", value: "h3" },
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
            name: "initiative",
            title: "Iniciativa relacionada",
            type: "reference",
            to: [{ type: "initiative" }],
        }),
        defineField({
            name: "results",
            title: "Resultados",
            type: "text",
            rows: 3,
        }),
        defineField({
            name: "metrics",
            title: "Métricas",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        { name: "label", title: "Etiqueta", type: "string" },
                        { name: "value", title: "Valor", type: "string" },
                    ],
                },
            ],
        }),
        defineField({
            name: "featured",
            title: "Destacado",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "publishedAt",
            title: "Fecha de publicación",
            type: "datetime",
        }),
    ],
    preview: {
        select: { title: "title", media: "mainImage", subtitle: "description" },
    },
});

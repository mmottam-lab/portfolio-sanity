import { defineField, defineType } from "sanity";

export default defineType({
    name: "roadmapItem",
    title: "Roadmap Item",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            rows: 3,
        }),
        defineField({
            name: "initiative",
            title: "Initiative",
            type: "reference",
            to: [{ type: "initiative" }],
            description: "The initiative this roadmap item belongs to (optional).",
        }),
        defineField({
            name: "startDate",
            title: "Start Date",
            type: "date",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "endDate",
            title: "End Date",
            type: "date",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Planned", value: "planned" },
                    { title: "In Progress", value: "in-progress" },
                    { title: "Completed", value: "completed" },
                    { title: "On Hold", value: "on-hold" },
                ],
                layout: "radio",
            },
            initialValue: "planned",
        }),
        defineField({
            name: "progress",
            title: "Progress (%)",
            type: "number",
            description: "Completion percentage (0–100).",
            validation: (Rule) => Rule.min(0).max(100),
            initialValue: 0,
        }),
        defineField({
            name: "color",
            title: "Bar Color",
            type: "string",
            description: "Custom color for the Gantt bar (optional, e.g. #62F6B5).",
        }),
    ],
    orderings: [
        {
            title: "Start Date (asc)",
            name: "startDateAsc",
            by: [{ field: "startDate", direction: "asc" }],
        },
    ],
    preview: {
        select: {
            title: "title",
            startDate: "startDate",
            endDate: "endDate",
            status: "status",
            initiative: "initiative.title",
        },
        prepare({ title, startDate, endDate, status, initiative }) {
            const range = [startDate, endDate].filter(Boolean).join(" → ");
            return {
                title,
                subtitle: `${range} — ${status || "planned"}${initiative ? ` — ${initiative}` : ""}`,
            };
        },
    },
});

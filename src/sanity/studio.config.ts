import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "./schemas";
import { sanityConfig } from "./config";

export default defineConfig({
    name: "portfolio-studio",
    title: "Portfolio Studio",
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    plugins: [structureTool(), visionTool(), codeInput()],
    schema: {
        types: schemaTypes,
    },
    basePath: "/studio",
});

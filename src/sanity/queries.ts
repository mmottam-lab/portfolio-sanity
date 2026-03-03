import { client } from "./client";

// Disable Next.js fetch cache so published content shows immediately
const fetchOptions = { next: { revalidate: 0 } } as any;

// Types
export interface Initiative {
    _id: string;
    title: string;
    slug: { current: string };
    description: string;
    mainImage: any;
    body: any[];
    status: "active" | "completed" | "planned";
    objectives: string[];
    technologies: string[];
    category: Category | null;
    featured: boolean;
    publishedAt: string;
}

export interface Category {
    _id: string;
    title: string;
    slug: { current: string };
    description: string;
    color: string;
}

export interface CaseStudy {
    _id: string;
    title: string;
    slug: { current: string };
    description: string;
    mainImage: any;
    body: any[];
    initiative: { _id: string; title: string; slug: { current: string } } | null;
    results: string;
    metrics: { label: string; value: string }[];
    featured: boolean;
    publishedAt: string;
}

export interface Subcategory {
    _id: string;
    title: string;
    slug: { current: string };
    description: string;
    icon: string;
    order: number;
    initiative: { _id: string; title: string } | null;
    projects: Project[];
}

export interface Project {
    _id: string;
    title: string;
    slug: { current: string };
    description: string;
    mainImage: any;
    body: any[];
    status: "active" | "completed" | "paused" | "planned";
    url: string;
    technologies: string[];
    order: number;
}

export interface RoadmapItem {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: "planned" | "in-progress" | "completed" | "on-hold";
    progress: number;
    color: string | null;
    initiative: { _id: string; title: string } | null;
}

// Queries
export async function getInitiatives(): Promise<Initiative[]> {
    return client.fetch(
        `*[_type == "initiative"] | order(publishedAt desc) {
      _id, title, slug, description, mainImage, status,
      objectives, technologies,
      category->{_id, title, slug, color},
      featured, publishedAt
    }`,
        {},
        fetchOptions
    );
}

export async function getFeaturedInitiatives(): Promise<Initiative[]> {
    return client.fetch(
        `*[_type == "initiative" && featured == true] | order(publishedAt desc) [0...6] {
      _id, title, slug, description, mainImage, status,
      objectives, technologies,
      category->{_id, title, slug, color},
      featured, publishedAt
    }`,
        {},
        fetchOptions
    );
}

export async function getInitiative(slug: string): Promise<Initiative> {
    return client.fetch(
        `*[_type == "initiative" && slug.current == $slug][0] {
      _id, title, slug, description, mainImage, body, status,
      objectives, technologies,
      category->{_id, title, slug, color},
      featured, publishedAt
    }`,
        { slug },
        fetchOptions
    );
}

// Fetch an initiative with its full subcategory → project hierarchy
export async function getInitiativeWithHierarchy(slug: string) {
    const initiative = await getInitiative(slug);
    if (!initiative) return { initiative: null, subcategories: [] };

    const subcategories: Subcategory[] = await client.fetch(
        `*[_type == "subcategory" && initiative._ref == $initiativeId] | order(order asc) {
      _id, title, slug, description, icon, order,
      "projects": *[_type == "project" && subcategory._ref == ^._id] | order(order asc) {
        _id, title, slug, description, mainImage, status, url, technologies, order
      }
    }`,
        { initiativeId: initiative._id },
        fetchOptions
    );

    return { initiative, subcategories };
}

// Get all subcategories for an initiative
export async function getSubcategoriesByInitiative(initiativeId: string): Promise<Subcategory[]> {
    return client.fetch(
        `*[_type == "subcategory" && initiative._ref == $initiativeId] | order(order asc) {
      _id, title, slug, description, icon, order,
      initiative->{_id, title}
    }`,
        { initiativeId },
        fetchOptions
    );
}

// Get all projects for a subcategory
export async function getProjectsBySubcategory(subcategoryId: string): Promise<Project[]> {
    return client.fetch(
        `*[_type == "project" && subcategory._ref == $subcategoryId] | order(order asc) {
      _id, title, slug, description, mainImage, body, status, url, technologies, order
    }`,
        { subcategoryId },
        fetchOptions
    );
}

export async function getCases(): Promise<CaseStudy[]> {
    return client.fetch(
        `*[_type == "case"] | order(publishedAt desc) {
      _id, title, slug, description, mainImage,
      initiative->{_id, title, slug},
      results, metrics, featured, publishedAt
    }`,
        {},
        fetchOptions
    );
}

export async function getCase(slug: string): Promise<CaseStudy> {
    return client.fetch(
        `*[_type == "case" && slug.current == $slug][0] {
      _id, title, slug, description, mainImage, body,
      initiative->{_id, title, slug},
      results, metrics, featured, publishedAt
    }`,
        { slug },
        fetchOptions
    );
}

export async function getRoadmap(): Promise<RoadmapItem[]> {
    return client.fetch(
        `*[_type == "roadmapItem"] | order(startDate asc) {
      _id, title, description, startDate, endDate, status, progress, color,
      initiative->{_id, title}
    }`,
        {},
        fetchOptions
    );
}

export async function getCategories(): Promise<Category[]> {
    return client.fetch(
        `*[_type == "category"] | order(title asc) {
      _id, title, slug, description, color
    }`,
        {},
        fetchOptions
    );
}

export async function getPage(slug: string) {
    return client.fetch(
        `*[_type == "page" && slug.current == $slug][0] {
      _id, title, slug, body
    }`,
        { slug },
        fetchOptions
    );
}

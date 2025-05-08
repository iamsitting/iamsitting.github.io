// lib/types.ts
// export Interface for Image Data
export interface ImageData {
    url: string;
}

// export Interface for Author Data
export interface Author {
    id: number; // Assuming each author has a unique ID
    name: string;
    email: string;
    avatar: ImageData; // Assuming the author has
}

// export Interface for Category Data
export interface Category {
    documentId: number; // Using numeric IDs for consistency
    name: string;
    description: string; // Optional description
}

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string; // rich markdown text
    createdAt: string; // ISO date string
    cover: ImageData; // Assuming this is the structure of your featured image
    author: Author; // The author of the blog post
    categories: Category[]; // An array of categories associated with the post
}

export interface UserBlogPostData {
    title: string;
    slug: string;
    description: string;
    content: string; //  rich markdown text
}

// Example response structure when fetching posts
export interface BlogPostResponse {
    data: BlogPost[];
}

// Example response structure when fetching a single post
export interface SingleBlogPostResponse {
    data: BlogPost; // The single blog post object
}

export interface PaginatedResponse {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}

export interface StrapiPost {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    cover: any;
    author: {
        id: number;
        name: string;
        email: string;
    };
    category: {
        id: number;
        name: string;
        slug: string | null;
        description: string | null;
    };
    blocks: Array<{
        __component: string;
        id: number;
        body: string;
    }>;
}
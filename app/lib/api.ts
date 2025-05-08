// lib/api.ts
import type { PaginatedResponse, Category } from './types';

const PAGE_LIMIT = 10;

export interface Post {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  author: {
    name: string;
  };
  category: {
    name: string;
  } | null;
  content: string;
}

// Map to store category name to ID mapping
const categoryNameToId = new Map<string, number>();

// Helper function to get or create category ID
function getCategoryId(name: string): number {
    if (!categoryNameToId.has(name)) {
        categoryNameToId.set(name, categoryNameToId.size + 1);
    }
    return categoryNameToId.get(name)!;
}

// Fetch all posts
export const getAllPosts = async (
    page: number = 1,
    searchQuery: string = "",
    categoryId?: number
): Promise<{ posts: Post[]; pagination: PaginatedResponse }> => {
    try {
        const response = await fetch('/posts.json');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        let posts: Post[] = await response.json();

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            posts = posts.filter(post => 
                post.title.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query)
            );
        }

        // Apply category filter
        if (categoryId) {
            posts = posts.filter(post => 
                post.category && getCategoryId(post.category.name) === categoryId
            );
        }

        // Sort by publishedAt
        posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

        // Apply pagination
        const start = (page - 1) * PAGE_LIMIT;
        const end = start + PAGE_LIMIT;
        const paginatedPosts = posts.slice(start, end);

        return {
            posts: paginatedPosts,
            pagination: {
                page,
                pageSize: PAGE_LIMIT,
                pageCount: Math.ceil(posts.length / PAGE_LIMIT),
                total: posts.length
            }
        };
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Server error");
    }
};

// Fetch a post by slug
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
    try {
        const response = await fetch('/posts.json');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts: Post[] = await response.json();
        
        const post = posts.find(p => p.slug === slug);
        return post || null;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw new Error("Server error");
    }
};

// Fetch all categories
export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const response = await fetch('/posts.json');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts: Post[] = await response.json();
        
        // Extract unique categories
        const categories = new Map<string, Category>();
        posts.forEach(post => {
            if (post.category && !categories.has(post.category.name)) {
                const id = getCategoryId(post.category.name);
                categories.set(post.category.name, {
                    documentId: id,
                    name: post.category.name,
                    description: ''
                });
            }
        });

        return Array.from(categories.values());
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Server error");
    }
};
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
  categories: {
    name: string;
  }[];
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

// Helper function to get the latest posts file
async function getLatestPostsFile(): Promise<Post[]> {
    // First get the version file
    const versionResponse = await fetch('/posts.version.json');
    if (!versionResponse.ok) {
        throw new Error('Failed to fetch posts version');
    }
    const { version } = await versionResponse.json();

    // Then get the versioned posts file
    const postsResponse = await fetch(`/posts.${version}.json`);
    if (!postsResponse.ok) {
        throw new Error('Failed to fetch posts');
    }
    return postsResponse.json();
}

// Fetch all posts
export const getAllPosts = async (
    page: number = 1,
    searchQuery: string = "",
    categoryId?: number
): Promise<{ posts: Post[]; pagination: PaginatedResponse }> => {
    try {
        let posts = await getLatestPostsFile();

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
                post.categories.some(category => {
                    const categoryName = Array.isArray(category.name) 
                        ? category.name[0] 
                        : category.name;
                    return getCategoryId(categoryName) === categoryId;
                })
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
        const posts = await getLatestPostsFile();
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
        const posts = await getLatestPostsFile();
        
        // Extract unique categories
        const categories = new Map<string, Category>();
        posts.forEach(post => {
            post.categories.forEach(category => {
                // Handle the case where category.name might be an array
                const categoryName = Array.isArray(category.name) 
                    ? category.name[0] 
                    : category.name;
                
                if (!categories.has(categoryName)) {
                    const id = getCategoryId(categoryName);
                    categories.set(categoryName, {
                        documentId: id,
                        name: categoryName,
                        description: ''
                    });
                }
            });
        });

        return Array.from(categories.values());
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Server error");
    }
};
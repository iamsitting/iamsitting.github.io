import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router";
import { getAllPosts, getAllCategories } from "../lib/api";
import { useDebounce } from "../lib/hooks";
import Loader from "../components/Loader";
import type { Category } from "~/lib/types";
import type { Post } from "~/lib/api";
import type { Route } from "./+types/blog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog | iamsitting" },
    { name: "description", content: "Read the latest articles on iamsitting" },
  ];
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({ pageCount: 0, total: 0 });
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setSelectedCategory(value);
    // Only reset page when category changes
    setCurrentPage(1);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch posts with filters
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await getAllPosts(currentPage, debouncedSearch, selectedCategory);
        setPosts(response.posts);
        setPagination(response.pagination);
        setError(null);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, debouncedSearch, selectedCategory]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Maintain input focus
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [posts]);

  if (isLoading && currentPage === 1) {
    return (
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="flex justify-center">
          <Loader message="Fetching blog posts..." />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-[#E8F5E8] mb-8">
        Blog Posts
      </h1>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search posts..."
            value={searchInput}
            onChange={handleSearchChange}
            className="flex-1 px-4 py-2 border border-[#4CAF50] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-[#E8F5E8] dark:bg-[#1A2A1A] dark:border-[#66BB6A] dark:text-white"
          />
          <select
            value={selectedCategory || ""}
            onChange={handleCategoryChange}
            className="px-4 py-2 border border-[#4CAF50] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-[#E8F5E8] dark:bg-[#1A2A1A] dark:border-[#66BB6A] dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.documentId} value={category.documentId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => (
          <div key={post.slug} className="card">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#E8F5E8] mb-2">
              {post.title}
            </h2>
            <div className="text-gray-600 dark:text-[#A3C9A3] mb-4">
              {new Date(post.publishedAt).toLocaleDateString()}
            </div>
            <p className="text-gray-700 dark:text-[#A3C9A3] mb-4">
              {post.description}
            </p>
            <Link to={`/post/${post.slug}`} className="text-[#4CAF50] hover:text-[#66BB6A] transition-colors">
              Read more →
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="text-gray-600 dark:text-[#A3C9A3]">
          Page {currentPage} of {pagination.pageCount}
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage >= pagination.pageCount}
            className="btn-primary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 
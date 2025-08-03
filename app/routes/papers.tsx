import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPapers } from "../lib/api";
import Loader from "../components/Loader";
import type { Post } from "~/lib/api";
import type { Route } from "./+types/papers";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Papers | iamsitting" },
    { name: "description", content: "Read papers and research on iamsitting" },
  ];
}

export default function Papers() {
  const [papers, setPapers] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await getAllPapers();
        setPapers(response);
        setError(null);
      } catch (error) {
        console.error("Error fetching papers:", error);
        setError("Failed to load papers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPapers();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="flex justify-center">
          <Loader message="Loading papers..." />
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
        Papers
      </h1>

      {papers.length === 0 ? (
        <div className="text-gray-600 dark:text-[#A3C9A3] text-center">
          No papers available yet.
        </div>
      ) : (
        <div className="space-y-6">
          {papers.map(paper => (
            <article key={paper.slug} className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#E8F5E8] mb-2">
                <Link 
                  to={`/papers/${paper.slug}`} 
                  className="text-[#4CAF50] hover:text-[#66BB6A] transition-colors"
                >
                  {paper.title}
                </Link>
              </h2>
              <div className="text-gray-600 dark:text-[#A3C9A3] mb-2">
                <time dateTime={paper.publishedAt}>
                  {new Date(paper.publishedAt + 'T00:00:00').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {paper.author && (
                  <>
                    <span> • </span>
                    <span>By {paper.author.name}</span>
                  </>
                )}
              </div>
              {paper.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {paper.categories.map(category => {
                    const categoryName = Array.isArray(category.name) 
                      ? category.name[0] 
                      : category.name;
                    return (
                      <span 
                        key={categoryName}
                        className="px-2 py-1 text-sm bg-[#4CAF50] bg-opacity-10 text-gray-900 dark:text-[#E8F5E8] rounded-full"
                      >
                        {categoryName}
                      </span>
                    );
                  })}
                </div>
              )}
              {paper.description && (
                <p className="text-gray-700 dark:text-[#A3C9A3] mb-3">
                  {paper.description}
                </p>
              )}
              <Link 
                to={`/papers/${paper.slug}`} 
                className="text-[#4CAF50] hover:text-[#66BB6A] transition-colors inline-flex items-center"
              >
                Read paper →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
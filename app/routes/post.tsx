import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPostBySlug } from "~/lib/api";
import Loader from "~/components/Loader";
import type { Post } from "~/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export default function Post() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      // Get the full path from the URL
      const fullPath = window.location.pathname.replace('/post/', '');
      if (!fullPath) {
        setError("Invalid post path");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPostBySlug(fullPath);
        if (!response) {
          throw new Error("Post not found");
        }
        setPost(response);
        setError(null);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params]);

  // Update meta tags when post data is available
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | iamsitting`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.description || 'Read this article on iamsitting');
      }
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="flex justify-center">
          <Loader message="Warming up the server..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="text-red-500 text-center mb-4">{error}</div>
        <div className="text-center">
          <Link to="/blog" className="text-[#4CAF50] hover:text-[#66BB6A] transition-colors">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="text-gray-500 text-center mb-4">Post not found</div>
        <div className="text-center">
          <Link to="/blog" className="text-[#4CAF50] hover:text-[#66BB6A] transition-colors">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <article className="prose prose-lg dark:prose-invert mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-[#E8F5E8] mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600 dark:text-[#A3C9A3]">
            <div className="flex items-center gap-2">
              <span>By {post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>•</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt + 'T00:00:00').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            {post.categories.length > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-2">
                  {post.categories.map((category, index) => (
                    <span key={category.name}>
                      {category.name}
                      {index < post.categories.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          {post.description && (
            <p className="text-xl text-gray-700 dark:text-[#A3C9A3] mt-4">
              {post.description}
            </p>
          )}
        </header>

        <div className="mt-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }: CodeProps) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark as any}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              // Customize other markdown elements
              h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
              p: ({ children }) => <p className="mb-4">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
              li: ({ children }) => <li className="mb-2">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[#4CAF50] pl-4 italic my-4">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a href={href} className="text-[#4CAF50] hover:text-[#66BB6A] underline">
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <img src={src} alt={alt} className="rounded-lg my-4 max-w-full h-auto" />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Share and Engagement Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center gap-6">
            {/* Share Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`;
                  window.open(url, '_blank');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Share on X
              </button>
              
              <button
                onClick={() => {
                  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
                  window.open(url, '_blank');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Share on LinkedIn
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </button>
            </div>

            {/* Engagement Section */}
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Have thoughts on this article? Share them on{' '}
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Thoughts on "${post.title}" by @iamsitting: ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4CAF50] hover:text-[#66BB6A] transition-colors"
                >
                  X (Twitter)
                </a>
              </p>
              
              <p className="text-gray-600 dark:text-gray-400">
                Want to get in touch? Email me at{' '}
                <span className="text-[#4CAF50]">
                  {`carlos [at] iamsitting [dot] com`}
                </span>
              </p>
            </div>
          </div>
        </div>
      </article>

      <div className="mt-8 text-center">
        <Link to="/blog" className="text-[#4CAF50] hover:text-[#66BB6A] transition-colors">
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
} 
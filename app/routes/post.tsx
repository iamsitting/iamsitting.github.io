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
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError("Invalid post slug");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPostBySlug(slug);
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
  }, [slug]);

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
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            {post.category && (
              <>
                <span>•</span>
                <span>{post.category.name}</span>
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
      </article>

      <div className="mt-8 text-center">
        <Link to="/blog" className="text-[#4CAF50] hover:text-[#66BB6A] transition-colors">
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
} 
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LatestPosts from "~/components/LatestPosts";
import { getAllPosts } from "~/lib/api";
import type { Post } from "~/lib/api";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { posts: fetchedPosts } = await getAllPosts();
        setPosts(fetchedPosts);
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CAF50]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#E8F5E8] mb-6">
          Welcome to <span className="text-[#4CAF50]">iamsitting</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-[#A3C9A3] max-w-2xl mx-auto mb-8">
          Exploring enterprise software development, cloud architecture, and technical leadership. Join me as I share insights on building scalable applications and navigating the cloud landscape.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/blog" className="btn-primary">Read the Blog</Link>
          <Link to="/about" className="btn-secondary">About Me</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#E8F5E8] mb-3">Software Development</h3>
            <p className="text-gray-700 dark:text-[#A3C9A3]">
              Deep dives into modern programming languages, frameworks, and enterprise application architecture. Best practices, patterns, and performance optimization.
            </p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#E8F5E8] mb-3">Cloud Architecture</h3>
            <p className="text-gray-700 dark:text-[#A3C9A3]">
              Cloud-native development, microservices, containers, and distributed systems design. Insights into modern cloud platforms and services.
            </p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#E8F5E8] mb-3">Technical Leadership</h3>
            <p className="text-gray-700 dark:text-[#A3C9A3]">
              Insights on team management, code reviews, and fostering engineering excellence in enterprise environments.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-12">
        <LatestPosts posts={posts} />
      </section>

      {/* Social Links Section */}
      <section className="py-12 card text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-[#E8F5E8] mb-4">Connect With Me</h2>
        <p className="text-gray-700 dark:text-[#A3C9A3] mb-6">
          Let's connect and discuss software development, cloud architecture, and technical leadership.
        </p>
        <div className="flex justify-center gap-6">
          {/* <a
            href="https://discord.gg/your-discord"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#4CAF50] hover:text-[#66BB6A] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a> */}
          <a 
          href="https://github.com/iamsitting"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#4CAF50] hover:text-[#66BB6A] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/cdsalamanca"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#4CAF50] hover:text-[#66BB6A] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a
            href="https://x.com/iamsitting"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#4CAF50] hover:text-[#66BB6A] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
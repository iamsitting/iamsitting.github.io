import { Link } from "react-router-dom";
import type { Post } from "~/lib/api";

interface LatestPostsProps {
  posts: Post[];
}

export default function LatestPosts({ posts }: LatestPostsProps) {
  // Create a map to track how many posts we've taken from each category
  const categoryCounts = new Map<string, number>();
  
  // Filter posts, maintaining original order but limiting per category
  const limitedPosts = posts.filter(post => {
    // Determine the primary category for this post
    // Handle the case where category.name might be an array
    const primaryCategory = post.categories.length > 0 
      ? (Array.isArray(post.categories[0].name) 
          ? post.categories[0].name[0] 
          : post.categories[0].name)
      : "Uncategorized";
    
    // Check if we can take this post based on its primary category
    const currentCount = categoryCounts.get(primaryCategory) || 0;
    const canTakePost = currentCount < 3;
    
    // If we can take the post, increment the count for its primary category only
    if (canTakePost) {
      categoryCounts.set(primaryCategory, currentCount + 1);
      return true;
    }
    
    return false;
  });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-[#E8F5E8]">
        Latest Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {limitedPosts.map((post) => (
          <div key={post.slug} className="card">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-[#E8F5E8] mb-2">
              {post.title}
            </h3>
            <div className="text-gray-600 dark:text-[#A3C9A3] mb-4">
              {new Date(post.publishedAt + 'T00:00:00').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
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
    </div>
  );
} 
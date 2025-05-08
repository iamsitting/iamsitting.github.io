import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MARKDOWN_DIR = path.join(__dirname, '..', 'content/markdown');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Ensure directories exist
if (!fs.existsSync(MARKDOWN_DIR)) {
  fs.mkdirSync(MARKDOWN_DIR, { recursive: true });
}

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Generate metadata for posts
function generatePostMetadata() {
  const markdownFiles = fs.readdirSync(MARKDOWN_DIR).filter(file => file.endsWith('.md'));
  const posts = markdownFiles.map(file => {
    const markdownPath = path.join(MARKDOWN_DIR, file);
    const markdownContent = fs.readFileSync(markdownPath, 'utf-8');
    
    // Extract metadata from frontmatter
    const { data: metadata, content } = matter(markdownContent);
    
    return {
      slug: file.replace('.md', ''),
      title: metadata.title || file.replace('.md', ''),
      description: metadata.description || '',
      publishedAt: metadata.date || new Date().toISOString(),
      author: {
        name: metadata.author || 'iamsitting'
      },
      category: metadata.category ? { name: metadata.category } : null,
      content: content
    };
  });

  // Write posts metadata to public directory
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'posts.json'),
    JSON.stringify(posts, null, 2)
  );

  console.log(`Generated posts.json with ${posts.length} posts`);
}

// Run the build process
generatePostMetadata(); 
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

// Recursively get all markdown files from a directory
function getAllMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Clean up old versioned files
function cleanupOldVersions() {
  const files = fs.readdirSync(PUBLIC_DIR);
  const oldVersions = files.filter(file => file.startsWith('posts.') && file.endsWith('.json') && file !== 'posts.version.json');
  
  for (const file of oldVersions) {
    fs.unlinkSync(path.join(PUBLIC_DIR, file));
  }
}

// Generate metadata for posts
function generatePostMetadata() {
  // Clean up old versions first
  cleanupOldVersions();

  const markdownFiles = getAllMarkdownFiles(MARKDOWN_DIR);
  const posts = markdownFiles.map(file => {
    const markdownContent = fs.readFileSync(file, 'utf-8');
    
    // Extract metadata from frontmatter
    const { data: metadata, content } = matter(markdownContent);
    
    // Get the relative path from MARKDOWN_DIR
    const relativePath = path.relative(MARKDOWN_DIR, file);
    const slug = relativePath.replace(/\.md$/, '');
    
    return {
      slug,
      title: metadata.title || path.basename(file, '.md'),
      description: metadata.description || '',
      publishedAt: metadata.date || new Date().toISOString(),
      author: {
        name: metadata.author || 'iamsitting'
      },
      category: metadata.category ? { name: metadata.category } : null,
      content: content
    };
  });

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Generate version timestamp
  const version = new Date().getTime();

  // Write posts metadata to public directory with version
  fs.writeFileSync(
    path.join(PUBLIC_DIR, `posts.${version}.json`),
    JSON.stringify(posts, null, 2)
  );

  // Also write a version file to track the latest version
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'posts.version.json'),
    JSON.stringify({ version })
  );

  console.log(`Generated posts.${version}.json with ${posts.length} posts`);
}

// Run the build process
generatePostMetadata(); 
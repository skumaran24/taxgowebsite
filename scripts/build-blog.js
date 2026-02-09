const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// Paths
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'blog');
const OUTPUT_DIR = path.join(__dirname, '..', 'blog');
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const SITEMAP_PATH = path.join(__dirname, '..', 'sitemap.xml');

// Base URL for the site
const BASE_URL = 'https://taxgo.blueaura.com.my';

// Configure marked for clean HTML output
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Read and return a template file
 */
function loadTemplate(name) {
  const templatePath = path.join(TEMPLATES_DIR, name);
  return fs.readFileSync(templatePath, 'utf-8');
}

/**
 * Calculate estimated reading time from text content
 */
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Format a date string into a readable format
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Convert a date string to ISO format
 */
function toISODate(dateStr) {
  return new Date(dateStr).toISOString();
}

/**
 * Generate tag HTML badges
 */
function generateTagsHTML(tags) {
  if (!tags || tags.length === 0) return '';
  return tags
    .map((tag) => `<span class="blog-tag">${tag}</span>`)
    .join('\n                    ');
}

/**
 * Replace template placeholders with actual values
 */
function renderTemplate(template, data) {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

/**
 * Generate a blog post card for the listing page
 */
function generatePostCard(post) {
  return `
                <a href="/blog/${post.slug}/" class="blog-card">
                    <div class="blog-card-content">
                        <div class="blog-card-meta">
                            <time datetime="${post.isoDate}">${post.formattedDate}</time>
                            <span class="blog-meta-separator">·</span>
                            <span>${post.readingTime} min read</span>
                        </div>
                        <h2>${post.title}</h2>
                        <p>${post.description}</p>
                        <div class="blog-card-tags">
                            ${generateTagsHTML(post.tags)}
                        </div>
                        <span class="blog-read-more">Read article →</span>
                    </div>
                </a>`;
}

/**
 * Update sitemap.xml with blog post URLs
 */
function updateSitemap(posts) {
  let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf-8');

  // Remove any existing blog entries
  sitemap = sitemap.replace(
    /\s*<!-- BLOG POSTS START -->[\s\S]*?<!-- BLOG POSTS END -->/,
    ''
  );

  // Build blog URL entries
  const today = new Date().toISOString().split('T')[0];
  let blogEntries = '\n    <!-- BLOG POSTS START -->';

  // Add blog listing page
  blogEntries += `
    <url>
        <loc>${BASE_URL}/blog/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`;

  // Add individual blog posts
  for (const post of posts) {
    blogEntries += `
    <url>
        <loc>${BASE_URL}/blog/${post.slug}/</loc>
        <lastmod>${post.date}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>`;
  }

  blogEntries += '\n    <!-- BLOG POSTS END -->';

  // Insert before closing </urlset> tag
  sitemap = sitemap.replace('</urlset>', `${blogEntries}\n</urlset>`);

  fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf-8');
  console.log(`  Updated sitemap.xml with ${posts.length} blog post(s)`);
}

/**
 * Main build function
 */
function build() {
  console.log('Building blog...\n');

  // Check if content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('  No content/blog/ directory found. Skipping blog build.');
    return;
  }

  // Get all markdown files
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.log('  No blog posts found. Skipping blog build.');
    return;
  }

  console.log(`  Found ${files.length} blog post(s)\n`);

  // Load templates
  const postTemplate = loadTemplate('blog-post.html');
  const listTemplate = loadTemplate('blog-list.html');

  // Process each post
  const posts = [];

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content: markdownContent } = matter(raw);

    // Derive slug from filename (remove .md extension)
    const slug = frontmatter.slug || file.replace('.md', '');

    // Process the post
    const post = {
      title: frontmatter.title || 'Untitled',
      description: frontmatter.description || '',
      date: frontmatter.date || new Date().toISOString().split('T')[0],
      author: frontmatter.author || 'TaxGo Team',
      tags: frontmatter.tags || [],
      image: frontmatter.image || '/images/taxgologo.png',
      slug,
      isoDate: toISODate(frontmatter.date || new Date()),
      formattedDate: formatDate(frontmatter.date || new Date()),
      readingTime: calculateReadingTime(markdownContent),
      content: marked(markdownContent),
      keywords: (frontmatter.tags || []).join(', '),
    };

    posts.push(post);

    // Generate post HTML
    const postHTML = renderTemplate(postTemplate, {
      ...post,
      tags: generateTagsHTML(post.tags),
    });

    // Write post to output directory
    const postDir = path.join(OUTPUT_DIR, slug);
    fs.mkdirSync(postDir, { recursive: true });
    fs.writeFileSync(path.join(postDir, 'index.html'), postHTML, 'utf-8');

    console.log(`  ✓ ${post.title} → /blog/${slug}/`);
  }

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Generate blog listing page
  const postsHTML = posts.map(generatePostCard).join('\n');
  const listHTML = renderTemplate(listTemplate, { posts: postsHTML });

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), listHTML, 'utf-8');

  console.log(`\n  ✓ Blog listing page → /blog/`);

  // Update sitemap
  updateSitemap(posts);

  console.log(`\nBlog build complete! ${posts.length} post(s) generated.\n`);
}

// Run the build
build();

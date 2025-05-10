# iamsitting's Blog

A blog built with React Router and TypeScript.

## Features

- Server-side rendering
- TypeScript
- TailwindCSS
- Markdown content
- Search functionality

## Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

## Content Management

1. Create markdown files in `content/markdown/YYYY/MM/`:
   ```markdown
   ---
   title: Your Post Title
   description: A brief description
   date: YYYY-MM-DD
   author: iamsitting
   slug: your-custom-slug  # Optional: If not provided, will use filename without extension
   categories: [Category1, Category2]  # Can be a single category or an array of categories
   ---

   Your post content...
   ```

2. Build content:
   ```bash
   yarn build:content
   ```

## Deployment

1. Build content:
   ```bash
   yarn build:content
   ```

2. Build application:
   ```bash
   yarn build
   ```

3. Deploy:
   ```bash
   yarn deploy
   ```

## Directory Structure

```
├── app/                    # Application code
│   ├── components/        # React components
│   ├── lib/              # Utilities and API
│   └── routes/           # Route components
├── content/
│   └── markdown/         # Blog posts
│       └── YYYY/        # Year directories
│           └── MM/      # Month directories
├── public/               # Static assets
│   ├── posts.*.json     # Versioned posts data
│   └── posts.version.json # Version tracker
├── scripts/             # Build scripts
└── package.json         # Project config
```

## Styling

This blog uses [Tailwind CSS](https://tailwindcss.com/) for styling. The design is responsive and follows modern web practices.

---

Built with ❤️ using React Router.

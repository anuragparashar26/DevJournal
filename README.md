# Personal Blog

A modern, responsive personal blog built with Next.js, TypeScript, and Tailwind CSS. Features a clean design with dark/light mode toggle, email subscription functionality for blog posts.

## ✨ Features

- **Modern Design**: Clean, minimalist interface with responsive layout
- **Dark/Light Mode**: Theme toggle with system preference detection
- **Email Subscriptions**: Newsletter signup functionality
- **Markdown Support**: Write blog posts using markdown syntax
- **Image Support**: Cloudinary integration for image hosting
- **SEO Optimized**: Meta tags and structured data
- **Fast Performance**: Built with Next.js 14 and optimized for speed
- **Comment System**: Readers can comment on posts; comments require admin approval.
- **Upvotes**: Readers can upvote posts (one upvote per user/IP).

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **Email Service**: SendGrid
- **Image Hosting**: Cloudinary
- **Deployment**: Vercel

## 📦 Prerequisites

Before running this project, make sure you have:

- Node.js 18.x or later
- npm package manager
- MongoDB database (local or cloud)
- Cloudinary account for image hosting
- SendGrid account for newsletters

## 🔒 Privacy: IP Salting

For features like upvotes and comment rate-limiting, this blog does not store raw IP addresses. Instead, IPs are hashed with a secret salt before being saved to the database. This ensures user privacy while still allowing basic anti-abuse protections (such as one upvote per user/IP and comment rate-limiting). The salt is never exposed or stored in the database.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/anuragparashar26/personal-blog
cd personal-blog
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email
SENDGRID_API_KEY=your_sendgrid_api
SENDGRID_LIST_ID=your_sendgrid_secret
SENDGRID_SENDER_ID=your_sendgrid_sender_id
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the blog.

## 📝 Content Management

To manage your blog content, you'll need to set up the admin panel separately. The admin panel allows you to:

- Create and edit blog posts
- Upload and manage images
- Preview posts before publishing
- Manage post metadata (title, slug, etc.)
- Save as Drafts

> **Note:** The admin panel for managing blog content is a private repository. If you need access or help with content management, please contact the project owner. Get Information about Admin Panel [here](assets/ADMIN_PANEL_README.md).

## 🌐 Deploying to Vercel

Vercel is the recommended platform for deploying this Next.js blog. Follow these steps:

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in with your GitHub account
   - Click "New Project"
   - Import your blog repository

3. **Configure the project**

   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (or specify if in a subdirectory)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Add Environment Variables**
   In the Vercel dashboard, go to your project settings and add all the environment variables from your `.env` file:

   ```
   MONGODB_URI
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   SENDGRID_API_KEY
   SENDGRID_LIST_ID
   SENDGRID_SENDER_ID
   ```

5. **Deploy**
   - Click "Deploy" and wait for the build to complete
   - Your blog will be available at `https://your-blog-name.vercel.app`

## 📁 Project Structure

```
personal-blog/
├── src/
│   ├── app/                 # App Router pages
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   ├── api/            # API routes
│   │   └── posts/          # Blog post pages
│   ├── components/         # Reusable components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── SubscribeForm.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.tsx
│   └── lib/                # Utility functions
│       ├── cloudinary.ts   # Cloudinary config
│       ├── mongodb.ts      # Database connection
│       └── types.ts        # TypeScript types
├── public/                 # Static assets
├── package.json
├── tailwind.config.ts      # Tailwind configuration
├── next.config.ts          # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## 📄 License

This project is open source and available under the [GPL3.0 License](LICENSE).

---

Built with ❤️ using Next.js and deployed on Vercel.

# DevJournal - Blog for Everyone

**DevJournal** is a modern, open-source blog template built with Next.js, TypeScript, and Tailwind CSS. Designed for developers and writers, it features a clean, responsive design, dark/light mode, markdown support, email subscriptions, comments, and upvotes. Easily deployable and customizable for your own personal or developer blog.

## Live Demo: [Click Here (Author's Blog)](https://blog.anuragparashar.tech)

<div align="center">
  <img src="/assets/demo.gif" alt="DevJournal" width="100%"/>
</div>

---

## ✨ Features

- **Modern UI**: Clean, minimalist, and responsive design
- **Dark/Light Mode**: Theme toggle with system preference detection
- **Markdown Blogging**: Write posts in markdown with code highlighting
- **Image Uploads**: Cloudinary integration for fast image hosting
- **SEO Optimized**: Meta tags and structured data for better discoverability
- **Email Subscriptions**: Newsletter signup with Mailgun
- **Comments & Upvotes**: Readers can comment (with moderation) and upvote posts
- **Privacy-first**: IPs are salted and hashed for anti-abuse, never stored in raw form
- **Easy Deployment**: Deploy to Vercel in minutes

---

## 🚀 Quick Start

### 1. Clone the Template

```bash
git clone https://github.com/anuragparashar26/dev-journal
cd dev-journal
```

> **Important:**  
> To use Dev Journal as your own blog, **fork this repository** on GitHub first, or after cloning, [create a new GitHub repo](https://github.com/new) and update your remote:
>
> ```bash
> git remote set-url origin https://github.com/your-username/your-repo.git
> ```
>
> This ensures your changes are pushed to your own repository, not the original.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
MAILGUN_MAILING_LIST=your_mailgun_mailing_list_address

# Security
IP_SALT=your_random_secret_salt
```

> **Tip:** You can get free accounts for [MongoDB Atlas](https://www.mongodb.com/atlas), [Cloudinary](https://cloudinary.com/), and [Mailgun](https://www.mailgun.com/).

### 4. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your blog.

---

## 🛠️ Customization

- **Branding**: Change the blog name, logo, and accent colors in `/src/app/layout.tsx`, `/src/app/globals.css`, and `/src/components/Header.tsx`.
- **Footer**: Edit `/src/components/Footer.tsx` to update copyright, privacy policy, and contact email links.
- **Privacy Policy**: Add or update your privacy policy and contact email (`/src/privacy-policy`).
- **Content**: Write posts in markdown via the admin panel (see below).
- **Styling**: Tweak Tailwind classes or extend the theme in `tailwind.config.ts`.
- **SEO**: Update meta tags in `/src/app/layout.tsx` and `/src/app/page.tsx`.

---

## 📝 Content Management

A separate admin panel is available for managing posts, images, and comments.  
**Note:** The admin panel is a private repo. [Learn more here](assets/ADMIN_PANEL_README.md) or contact the maintainer for access.

---

## 🌐 Deploying to Vercel

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Set environment variables in the Vercel dashboard
   - Click **Deploy**

Your blog will be live at `https://your-project-name.vercel.app`.

---

## 📁 Project Structure

```
dev-journal/
├── src/
│   ├── app/                 # App Router pages
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── api/             # API routes
│   │   └── posts/           # Blog post pages
│   ├── components/          # Reusable components
│   ├── contexts/            # React contexts
│   └── lib/                 # Utility functions
├── public/                  # Static assets
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## 🔒 Privacy & Security

- **IP Salting**: For upvotes and comment rate-limiting, IPs are hashed with a secret salt before storage.
- **No raw IPs**: Raw IP addresses are never stored in the database.

---

## 📄 License

This template is open source under the [GPL3.0 License](LICENSE).

---

Built with ❤️ using Next.js and deployed on Vercel.

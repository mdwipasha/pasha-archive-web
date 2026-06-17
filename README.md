<div align="center">

# 🗂️ Pasha Archive

**A personal digital scrapbook for preserving moments, stories, and experiences — all in one place.**

</div>

---

## 🖼️ Preview

| Home Page | Galleries Page |
|---|---|
| ![Gallery view](https://res.cloudinary.com/dfluo0iya/image/upload/v1781670524/screencapture-mdpashaaa-web-id-2026-06-17-11_28_16_pbphwx.png) | ![Memory detail](https://res.cloudinary.com/dfluo0iya/image/upload/v1781669957/screencapture-mdpashaaa-web-id-galleries-2026-06-17-11_16_55_rdci0d.png) |

| Galleries Modal | Galleries Comment Page |
|---|---|
| ![Galleries Modal](https://res.cloudinary.com/dfluo0iya/image/upload/v1781669956/Screenshot_2026-06-17_111855_iqva5s.png) | ![Galleries Comment Page](https://res.cloudinary.com/dfluo0iya/image/upload/v1781670166/screencapture-mdpashaaa-web-id-galleries-bimbingan-pekael-2026-06-17-11_19_53_xeyny6.png) |

| Submission Memories Page | Login Page |
|---|---|
| ![Submission Memories Page](https://res.cloudinary.com/dfluo0iya/image/upload/v1781670166/screencapture-mdpashaaa-web-id-submit-memory-2026-06-17-11_20_17_suvn6s.png) | ![Submission Request Page](https://res.cloudinary.com/dfluo0iya/image/upload/v1781670164/screencapture-mdpashaaa-web-id-admin-2026-06-17-11_22_24_csr7l9.png) |

| Login Page | Dashboard Page |
|---|---|
| ![Login Page](https://res.cloudinary.com/dfluo0iya/image/upload/v1781670165/login_qfqo54.png) | ![Dashboard Page](https://res.cloudinary.com/dfluo0iya/image/upload/v1781670166/Screenshot_2026-06-17_112128_aqtpj4.png) |

| Add Memories | Edit Memories |
|---|---|
| ![Add Memories](https://res.cloudinary.com/dfluo0iya/image/upload/v1781670165/screencapture-mdpashaaa-web-id-admin-2026-06-17-11_22_13_phqmiw.png) | ![Edit Memories](https://res.cloudinary.com/dfluo0iya/image/upload/v1781670165/Screenshot_2026-06-17_112154_fb66ad.png) |

> 🔗 You can also try the live version here: **[www.mdpashaaa.web.id](https://www.mdpashaaa.web.id)**

---

## 🌟 About The Project

**Pasha Archive** is a personal gallery website built to document meaningful moments — photos, videos, locations, and the stories behind them — in one organized, browsable place.

The goal is simple: **capture moments, tell stories, and keep memories alive.**

---

## ✨ Features

### 🖼️ Gallery Collection
- Browse memories through a clean, responsive gallery layout
- Supports both photos and videos
- Detailed memory pages with descriptions and metadata
- Featured memories showcase on the homepage

### 🗺️ Memories Map
- Explore memories through an interactive, Leaflet-powered map
- Zoom-based clustering — zoomed out shows city clusters, zoomed in shows individual memories
- Click a pin to jump straight to that memory

### ❤️ Community Interaction
- Like memorable moments
- Leave comments on memories, with threaded replies
- Real-time updates powered by Supabase

### 🔍 Discover Memories
- Instant search across memories
- Filter by **type**, **year**, **location**, **tags**, and **people**

### 📤 Memory Submission System
- Visitors can submit a new memory for review, including:
  - Photos or videos
  - A story/description
  - Date and location information

### ⚙️ Admin Dashboard
- Review, approve, or reject submitted memories
- Content management system for the archive
- Cloudinary media integration

### 📱 Modern Experience
- Fully responsive, mobile-first design
- Smooth page transitions and micro-animations
- Fast page loads via Astro's island architecture
- SEO-optimized pages
- Neo-Brutalist interface

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Astro](https://astro.build) (with [React](https://react.dev) islands) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) |
| **Animation** | [Motion](https://motion.dev) |
| **Maps** | [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org) + marker clustering |
| **Database & Backend** | [Supabase](https://supabase.com) — PostgreSQL, Realtime, Row Level Security (RLS) |
| **Media Storage** | [Cloudinary](https://cloudinary.com) |

---

## 📁 Project Structure

```
pasha-archive-web/
├── public/                    # Static assets (favicon, etc.)
├── src/
│   ├── assets/                 # Images, fonts, and other bundled assets
│   ├── components/
│   │   ├── Admin/               # Admin dashboard components
│   │   ├── Comments/            # Comment system (card, form, section, toast)
│   │   ├── Gallery/              # Gallery grid & memory card components
│   │   ├── Hero.astro
│   │   ├── MemoriesMap.jsx       # Interactive Leaflet map
│   │   ├── Navbar.astro
│   │   ├── Footer.astro
│   │   ├── RecentArchive.astro
│   │   ├── SubmitMemoryForm.jsx  # Submit Memory System for Public
│   │   └── SubmitPageCTA.astro
│   ├── layouts/
│   │   └── Layout.astro         # Base page layout
│   ├── lib/
│   │   ├── cloudinary.js        # Cloudinary upload/config helpers
│   │   └── supabase.ts          # Supabase client
│   ├── pages/
│   │   ├── admin/                # Admin dashboard page
│   │   ├── api/                  # Server endpoints (Cloudinary, memory requests)
│   │   ├── galleries/            # Gallery list + dynamic memory detail page
│   │   ├── index.astro           # Homepage
│   │   └── submit-memory.astro   # Public memory submission page
│   └── styles/                 # Global styles
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## 🗃️ Database Schema

The app is backed by a relational schema in Supabase. Memories are the core entity, with **tags** and **people** linked through junction tables — this avoids duplicating data and keeps the people/tag registries reusable across memories.

```mermaid
erDiagram
    memories ||--o{ memory_tags : "tagged with"
    tags ||--o{ memory_tags : "applied to"
    memories ||--o{ memory_people : "features"
    people ||--o{ memory_people : "appears in"
    memories ||--o{ memory_comments : "has"
    memory_comments ||--o{ memory_comments : "replies to"
    comment_visitors ||--o{ memory_comments : "writes"
    memories ||--o{ memory_likes : "has"
    memories ||--o{ memory_liked_visitors : "liked by"

    memories {
        int8 id PK
        text title
        text slug
        memory_type type
        text description
        date date
        int4 year
        text location
        numeric latitude
        numeric longitude
        text src
        text thumbnail_url
        text cloudinary_public_id
        bool featured
    }
    tags {
        int8 id PK
        text tag
    }
    people {
        int8 id PK
        text name
        text social_media
    }
    memory_tags {
        int8 memory_id FK
        int8 tag_id FK
    }
    memory_people {
        int8 memory_id FK
        int8 person_id FK
    }
    memory_comments {
        int8 id PK
        int8 memory_id FK
        text username
        text comment 
        int8 parent_id FK
        text visitor_id FK
        bool is_anonymous
    }
    comment_visitors {
        text visitor_id PK
        text name
    }
    memory_likes {
        int8 id PK
        int8 memory_id FK
        int4 count
    }
    memory_liked_visitors {
        int8 id PK
        int8 memory_id FK
        text visitor_id
    }
    memory_requests {
        int8 id PK
        text contributor_name
        text contributor_email
        text title
        text description
        text type
        memory_type type
        date date
        text location
        text latitude
        text longitude
        text src
        text thumbnail_url
        text cloudinary_public_id
        text status
        text admin_note
        text approved_by
        timestamptz approved_at
    }
```

> ℹ️ `memory_requests` is a standalone submissions table — pending memories live here until an admin approves them and they're promoted into `memories`.

---

## 🚀 Getting Started

### Prerequisites

- A [Supabase](https://supabase.com) project
- A [Cloudinary](https://cloudinary.com) account

### 1. Clone the repository

```bash
git clone https://github.com/mdwipasha/pasha-archive-web.git
cd pasha-archive-web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Supabase
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudinary (Public)
PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Cloudinary (Server)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:4321
```

## Troubleshooting

Possible causes:

- No admin user has been created in Supabase Authentication.
- Row Level Security (RLS) policies are missing or incorrectly configured.
- Supabase & Cloudinary API keys are invalid.

---

## 🗺️ Roadmap

- [ ] Memory timeline view
- [ ] Export archive as a downloadable PDF/scrapbook

> Have an idea? Feel free to [open an issue](https://github.com/mdwipasha/pasha-archive-web/issues).

---

## Created By

**Pasha [(Capa)](https://instagram.com/mdpashaaa)**

<div align="center">

*Built as a personal project to preserve moments, tell stories, and create a digital archive that can be revisited for years to come.*

</div>

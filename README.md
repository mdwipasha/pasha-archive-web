# Pasha Archive

A personal digital scrapbook built to preserve moments, stories, and experiences in one place.

## 🌟 About The Project

Pasha Archive is a personal gallery website designed to document meaningful moments through photos, videos, locations, and stories.

The goal of this project is simple: **capture moments, tell stories, and keep memories alive.**

## ✨ Features

### 🖼️ Gallery Collection

* Browse memories through a clean gallery layout.
* Support for both photos and videos.
* Detailed memory pages with descriptions and metadata.
* Featured memories showcase.

### 🗺️ Memories Map

* Explore memories through an interactive map.
* Zoom into locations to discover individual memories.
* View memories based on their geographic locations.

### ❤️ Community Interaction

* Like memorable moments.
* Leave comments on memories.
* Reply to comments with threaded discussions.
* Real-time updates powered by Supabase.

### 🔍 Discover Memories

* Search memories instantly.
* Filter memories by:
  * Type
  * Year
  * Location
  * Tags
  * People

### 📤 Memory Submission System

* Visitors can request new memories to be added by submitting:
  * Photos
  * Videos
  * Story descriptions
  * Location information

### ⚙️ Admin Dashboard

* Cloudinary media integration.
* Content management system for the archive.

### 📱 Modern Experience

* Fully responsive design.
* Smooth animations and transitions.
* Fast page loading with Astro.
* Optimized media delivery.
* SEO optimized
* Neo-Brutalism inspired interface.

---

## 🛠 Tech Stack

### Frontend

* Astro
* React
* Tailwind CSS
* Framer Motion
* React Leaflet Map

### Backend & Database

* Supabase

  * PostgreSQL Database
  * Realtime
  * Authentication
  * Row Level Security (RLS)

### Storage & Media

* Cloudinary

## Schema Database
## Table `memory_comments`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `memory_id` | `int8` |  |
| `username` | `text` |  |
| `comment` | `text` |  |
| `parent_id` | `int8` |  Nullable |
| `visitor_id` | `text` |  Nullable |
| `is_anonymous` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `memory_liked_visitors`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `memory_id` | `int8` |  |
| `visitor_id` | `text` |  |

## Table `tags`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `tag` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `people`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `name` | `text` |  |
| `social_media` | `text` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `memories`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `title` | `text` |  Nullable |
| `slug` | `text` |  Unique |
| `type` | `memory_type` |  |
| `description` | `text` |  Nullable |
| `date` | `date` |  Nullable |
| `year` | `int4` |  Nullable |
| `location` | `text` |  Nullable |
| `latitude` | `numeric` |  Nullable |
| `longitude` | `numeric` |  Nullable |
| `src` | `text` |  Nullable |
| `thumbnail_url` | `text` |  Nullable |
| `cloudinary_public_id` | `text` |  Nullable |
| `featured` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `memory_tags`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `memory_id` | `int8` | Primary |
| `tag_id` | `int8` | Primary |

## Table `memory_people`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `memory_id` | `int8` | Primary |
| `person_id` | `int8` | Primary |

## Table `memory_likes`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` |  Identity |
| `memory_id` | `int8` | Primary |
| `count` | `int4` |  Nullable |

## Table `memory_requests`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `contributor_name` | `text` |  |
| `contributor_email` | `text` |  Nullable |
| `title` | `text` |  |
| `description` | `text` |  Nullable |
| `type` | `memory_type` |  |
| `date` | `date` |  Nullable |
| `location` | `text` |  Nullable |
| `latitude` | `numeric` |  Nullable |
| `longitude` | `numeric` |  Nullable |
| `src` | `text` |  |
| `thumbnail_url` | `text` |  Nullable |
| `cloudinary_public_id` | `text` |  |
| `status` | `text` |  |
| `admin_note` | `text` |  Nullable |
| `approved_at` | `timestamptz` |  Nullable |
| `approved_by` | `text` |  Nullable |
| `created_at` | `timestamptz` |  |

## Table `comment_visitors`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `visitor_id` | `text` | Primary |
| `name` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/mdwipasha/pasha-archive-web.git
cd pasha-archive-web
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

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

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:4321
```

---

## 📈 Project Highlights

* Personal Digital Scrapbook
* Interactive Memories Map
* Admin Content Management System
* Memory Submission Workflow
* Real-time Likes & Comments
* Advanced Search & Filtering
* Neo-Brutalism Design System
* Cloudinary Media Management
* SEO Optimized
* Mobile First Experience

---

Created by **Pasha (Capa)**

* Instagram: https://instagram.com/mdpashaaa

Built as a personal project to preserve moments, tell stories, and create a digital archive that can be revisited for years to come.

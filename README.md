# ResumeAgent AI 🤖

> **Land Your Dream Job in 60 Seconds** — AI-powered resume optimizer built with Next.js 14 and Google Gemini.

## ✨ Features

- **Tailored Resume** — Your resume rewritten to match the job posting's language and requirements
- **Cover Letter Generator** — A professional, personalized cover letter for every application
- **Match Score** — Animated before/after circular progress indicators showing how well your resume matches the job
- **Interview Prep** — 5 targeted Q&A pairs based on the actual job description
- **PDF Export** — Download your tailored resume or cover letter as a PDF
- **Before/After View** — Side-by-side comparison of original vs optimized resume

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Google Gemini 1.5 Flash** (AI backbone, free tier)
- **Cheerio** (job posting scraper)
- **Framer Motion** (animations)
- **jsPDF** (PDF export)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dakshverma-dev/Hack-the-vibe.git
   cd Hack-the-vibe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   > **How to get a free Gemini API key:**
   > 1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   > 2. Sign in with your Google account
   > 3. Click **Create API key** and copy the key

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/
│   ├── page.tsx              # Landing page with hero section
│   ├── layout.tsx            # Root layout with metadata
│   ├── globals.css           # Global styles & CSS variables
│   └── api/
│       ├── scrape/route.ts   # Cheerio-based job scraper
│       └── optimize/route.ts # Gemini resume optimizer
├── components/
│   ├── ResumeInput.tsx       # Main input form
│   ├── ResultsTabs.tsx       # Tabbed results interface
│   ├── MatchScoreCard.tsx    # Animated circular progress rings
│   ├── InterviewPrep.tsx     # Accordion Q&A component
│   └── DownloadButton.tsx    # jsPDF download button
├── lib/
│   ├── openai.ts             # Google Gemini client configuration
│   ├── scraper.ts            # Cheerio scraping logic
│   └── pdfExport.ts          # PDF generation utilities
├── .env.local.example        # Environment variables template
└── README.md
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key (free tier available at [aistudio.google.com](https://aistudio.google.com/app/apikey)) | ✅ Yes |

## ⚙️ API Routes

### `POST /api/scrape`
Scrapes job details from a URL using Cheerio.

**Request:**
```json
{ "url": "https://www.linkedin.com/jobs/view/..." }
```

**Response:**
```json
{
  "jobTitle": "Senior Software Engineer",
  "company": "Acme Corp",
  "jobDescription": "We are looking for..."
}
```

### `POST /api/optimize`
Optimizes resume using Google Gemini 1.5 Flash.

**Request:**
```json
{
  "resume": "Your resume text...",
  "jobDescription": "Job description text...",
  "jobTitle": "Senior Software Engineer",
  "company": "Acme Corp"
}
```

**Response:**
```json
{
  "tailoredResume": "Optimized resume...",
  "coverLetter": "Dear Hiring Manager...",
  "matchScore": 45,
  "newMatchScore": 87,
  "keywordsAdded": ["React", "Node.js", "AWS"],
  "interviewQuestions": [
    { "question": "...", "idealAnswer": "..." }
  ]
}
```

## 📄 License

MIT

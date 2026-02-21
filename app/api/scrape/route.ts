import { NextRequest, NextResponse } from "next/server";
import { scrapeJob } from "@/lib/scraper";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: "URL must use HTTP or HTTPS protocol" }, { status: 400 });
    }

    const jobData = await scrapeJob(url);
    return NextResponse.json(jobData);
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to scrape job posting" },
      { status: 500 }
    );
  }
}

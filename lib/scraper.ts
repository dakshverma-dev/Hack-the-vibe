import * as cheerio from "cheerio";

export interface ScrapedJob {
  jobTitle: string;
  company: string;
  jobDescription: string;
}

export async function scrapeJob(url: string): Promise<ScrapedJob> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove script and style tags
  $("script, style, nav, footer, header").remove();

  // Try to extract job title
  let jobTitle =
    $('h1[class*="job"], h1[class*="title"], [class*="job-title"], [class*="jobtitle"]').first().text().trim() ||
    $("h1").first().text().trim() ||
    $("title").text().trim().split("|")[0].trim() ||
    $("title").text().trim().split("-")[0].trim() ||
    "Software Engineer";

  // Try to extract company name
  let company =
    $('[class*="company"], [class*="employer"], [data-company]').first().text().trim() ||
    $('[class*="org"]').first().text().trim() ||
    "Company";

  // Try to extract job description
  let jobDescription =
    $('[class*="description"], [class*="job-desc"], [id*="description"], [class*="posting"]').first().text().trim() ||
    $("main").text().trim() ||
    $("body").text().trim();

  // Clean up whitespace
  jobTitle = jobTitle.replace(/\s+/g, " ").trim().substring(0, 200);
  company = company.replace(/\s+/g, " ").trim().substring(0, 200);
  jobDescription = jobDescription.replace(/\s+/g, " ").trim().substring(0, 5000);

  return { jobTitle, company, jobDescription };
}

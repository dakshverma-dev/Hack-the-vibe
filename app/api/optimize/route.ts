import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume, jobDescription, jobTitle, company } = body;

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert professional resume writer and career coach with 15+ years of experience helping candidates land top jobs at Fortune 500 companies. Your task is to optimize resumes for specific job postings.

When given a resume and job description, you will:
1. Tailor the resume to match the job requirements, incorporating relevant keywords
2. Write a compelling cover letter
3. Calculate a match score before and after optimization
4. Identify key terms/skills added during optimization
5. Generate targeted interview questions with ideal answers

Always return valid JSON with no markdown code blocks.

Please optimize this resume for the following job posting and return a JSON response.

JOB DETAILS:
Title: ${jobTitle || "Not specified"}
Company: ${company || "Not specified"}
Description: ${jobDescription}

ORIGINAL RESUME:
${resume}

Return a JSON object with exactly these fields:
{
  "tailoredResume": "The optimized resume text incorporating job-relevant keywords and highlighting matching experience",
  "coverLetter": "A professional 3-paragraph cover letter tailored to this role",
  "matchScore": <number 0-100 representing original resume match percentage>,
  "newMatchScore": <number 0-100 representing optimized resume match percentage, always higher than matchScore>,
  "keywordsAdded": ["keyword1", "keyword2", ...array of 5-10 key terms added or highlighted],
  "interviewQuestions": [
    {"question": "Question text", "idealAnswer": "Detailed ideal answer"},
    ... exactly 5 question/answer pairs
  ]
}`;

    const result = await getModel().generateContent(prompt);
    const resultText = result.response.text();
    if (!resultText) {
      throw new Error("No response from AI");
    }

    // Strip markdown code fences if present
    const cleaned = resultText.replace(/^```(?:json)?\s*|\s*```$/gi, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Optimize error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to optimize resume" },
      { status: 500 }
    );
  }
}

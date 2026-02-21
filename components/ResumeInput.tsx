"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ResumeInputProps {
  onResult: (result: OptimizeResult, originalResume: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface OptimizeResult {
  tailoredResume: string;
  coverLetter: string;
  matchScore: number;
  newMatchScore: number;
  keywordsAdded: string[];
  interviewQuestions: { question: string; idealAnswer: string }[];
}

const LOADING_MESSAGES = [
  "Analyzing your resume...",
  "Scraping job posting...",
  "Identifying key requirements...",
  "Tailoring your experience...",
  "Crafting your cover letter...",
  "Calculating match score...",
  "Preparing interview questions...",
  "Finalizing your results...",
];

export default function ResumeInput({ onResult, isLoading, setIsLoading }: ResumeInputProps) {
  const [resume, setResume] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [error, setError] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resume.trim()) {
      setError("Please paste your resume text.");
      return;
    }
    if (!jobUrl.trim()) {
      setError("Please enter a job posting URL.");
      return;
    }

    setIsLoading(true);
    setLoadingStep(0);

    // Cycle through loading messages
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);

    try {
      // Step 1: Scrape the job posting
      const scrapeResponse = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobUrl }),
      });

      if (!scrapeResponse.ok) {
        const err = await scrapeResponse.json();
        throw new Error(err.error || "Failed to scrape job posting");
      }

      const jobData = await scrapeResponse.json();

      // Step 2: Optimize the resume
      const optimizeResponse = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          jobDescription: jobData.jobDescription,
          jobTitle: jobData.jobTitle,
          company: jobData.company,
        }),
      });

      if (!optimizeResponse.ok) {
        const err = await optimizeResponse.json();
        throw new Error(err.error || "Failed to optimize resume");
      }

      const result = await optimizeResponse.json();
      onResult(result, resume);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 shadow-2xl shadow-purple-100">
        <div className="space-y-6">
          {/* Resume Textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Resume
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text here..."
              rows={10}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm text-gray-700 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Job URL Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Posting URL
            </label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://www.linkedin.com/jobs/view/..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm text-gray-700 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm border border-red-200"
            >
              <span>⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-purple-600 bg-purple-50 px-4 py-4 rounded-xl border border-purple-200"
            >
              <svg className="animate-spin h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <div>
                <p className="font-semibold text-sm">{LOADING_MESSAGES[loadingStep]}</p>
                <p className="text-xs text-purple-400 mt-0.5">This may take 30-60 seconds</p>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-8 gradient-bg text-white font-bold text-lg rounded-2xl hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-300 hover:shadow-xl active:scale-[0.98]"
          >
            {isLoading ? "Optimizing..." : "✨ Optimize My Resume"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

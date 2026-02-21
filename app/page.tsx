"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ResumeInput from "@/components/ResumeInput";
import ResultsTabs from "@/components/ResultsTabs";

interface OptimizeResult {
  tailoredResume: string;
  coverLetter: string;
  matchScore: number;
  newMatchScore: number;
  keywordsAdded: string[];
  interviewQuestions: { question: string; idealAnswer: string }[];
}

export default function Home() {
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [originalResume, setOriginalResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResult = (res: OptimizeResult, original: string) => {
    setResult(res);
    setOriginalResume(original);
    // Scroll to results
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/5 rounded-full" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">
              <span>🤖</span>
              <span>Powered by GPT-4o</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white text-center mb-4 leading-tight"
          >
            Land Your Dream Job
            <br />
            <span className="text-yellow-300">in 60 Seconds</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/80 text-center mb-12 max-w-2xl mx-auto"
          >
            Paste your resume, drop a job URL, and let our AI tailor your resume,
            write a cover letter, and prepare you for the interview — instantly.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {[
              "✅ Tailored Resume",
              "✉️ Cover Letter",
              "🎯 Match Score",
              "🎤 Interview Prep",
            ].map((feature) => (
              <span
                key={feature}
                className="bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full border border-white/30"
              >
                {feature}
              </span>
            ))}
          </motion.div>

          {/* Input Form */}
          <ResumeInput
            onResult={handleResult}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section id="results" className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
              🎉 Your Optimized Application
            </h2>
            <p className="text-gray-500">
              Your resume has been tailored for this specific job posting.
            </p>
          </motion.div>
          <ResultsTabs result={result} originalResume={originalResume} />
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-purple-100 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>
            Built with ❤️ using Next.js 14 &amp; GPT-4o •{" "}
            <span className="text-purple-400">ResumeAgent AI</span>
          </p>
        </div>
      </footer>
    </main>
  );
}

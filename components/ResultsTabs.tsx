"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MatchScoreCard from "./MatchScoreCard";
import InterviewPrep from "./InterviewPrep";
import DownloadButton from "./DownloadButton";

interface InterviewQuestion {
  question: string;
  idealAnswer: string;
}

interface OptimizeResult {
  tailoredResume: string;
  coverLetter: string;
  matchScore: number;
  newMatchScore: number;
  keywordsAdded: string[];
  interviewQuestions: InterviewQuestion[];
}

interface ResultsTabsProps {
  result: OptimizeResult;
  originalResume: string;
}

const tabs = [
  { id: "resume", label: "Tailored Resume", icon: "📄" },
  { id: "cover", label: "Cover Letter", icon: "✉️" },
  { id: "score", label: "Match Score", icon: "🎯" },
  { id: "interview", label: "Interview Prep", icon: "🎤" },
];

export default function ResultsTabs({ result, originalResume }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState("resume");
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl mx-auto mt-10"
    >
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-1 bg-white rounded-2xl p-1.5 shadow-md mb-6 border border-purple-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-purple-50"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "resume" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    {showOriginal ? "Original Resume" : "Tailored Resume"}
                  </h3>
                  <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="text-xs px-3 py-1.5 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                  >
                    {showOriginal ? "Show Optimized →" : "← Show Original"}
                  </button>
                </div>
                {!showOriginal && (
                  <DownloadButton
                    content={result.tailoredResume}
                    filename="tailored-resume"
                    label="Download Resume"
                  />
                )}
              </div>
              <div className="glass-card rounded-2xl p-6 min-h-[400px]">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                  {showOriginal ? originalResume : result.tailoredResume}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "cover" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-lg font-bold text-gray-800">Cover Letter</h3>
                <DownloadButton
                  content={result.coverLetter}
                  filename="cover-letter"
                  label="Download Cover Letter"
                />
              </div>
              <div className="glass-card rounded-2xl p-6 min-h-[400px]">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                  {result.coverLetter}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "score" && (
            <MatchScoreCard
              matchScore={result.matchScore}
              newMatchScore={result.newMatchScore}
              keywordsAdded={result.keywordsAdded}
            />
          )}

          {activeTab === "interview" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Interview Preparation</h3>
              <InterviewPrep questions={result.interviewQuestions} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

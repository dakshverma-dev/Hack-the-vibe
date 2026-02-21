"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MatchScoreCardProps {
  matchScore: number;
  newMatchScore: number;
  keywordsAdded: string[];
}

function CircularProgress({
  score,
  label,
  animate,
}: {
  score: number;
  label: string;
  animate: boolean;
}) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 50) return "#ef4444";
    if (s < 75) return "#eab308";
    return "#22c55e";
  };

  useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setDisplayScore(current);
        if (current >= score) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [score, animate]);

  const color = getColor(displayScore);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <div className="relative">
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 64 64)"
            style={{ transition: "stroke-dashoffset 0.05s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {displayScore}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MatchScoreCard({
  matchScore,
  newMatchScore,
  keywordsAdded,
}: MatchScoreCardProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="glass-card rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Resume Match Score
        </h3>
        <div className="flex justify-around items-center flex-wrap gap-8">
          <CircularProgress
            score={matchScore}
            label="Before Optimization"
            animate={animate}
          />
          <div className="flex flex-col items-center">
            <div className="text-4xl text-purple-600">→</div>
            <p className="text-sm text-green-600 font-semibold mt-1">
              +{newMatchScore - matchScore}% improvement
            </p>
          </div>
          <CircularProgress
            score={newMatchScore}
            label="After Optimization"
            animate={animate}
          />
        </div>
      </div>

      {keywordsAdded && keywordsAdded.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            🔑 Keywords Added / Highlighted
          </h4>
          <div className="flex flex-wrap gap-2">
            {keywordsAdded.map((keyword, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200"
              >
                {keyword}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

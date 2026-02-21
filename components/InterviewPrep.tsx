"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InterviewQuestion {
  question: string;
  idealAnswer: string;
}

interface InterviewPrepProps {
  questions: InterviewQuestion[];
}

export default function InterviewPrep({ questions }: InterviewPrepProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-3"
    >
      <p className="text-gray-600 mb-4">
        Prepare for these likely interview questions based on the job requirements:
      </p>
      {questions.map((item, index) => (
        <div key={index} className="glass-card rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-purple-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <span className="font-semibold text-gray-800 text-sm sm:text-base">
                {item.question}
              </span>
            </div>
            <motion.span
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 ml-3 text-purple-600 text-xl"
            >
              ▼
            </motion.span>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-5 pb-5 border-t border-purple-100">
                  <div className="pt-4">
                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">
                      Ideal Answer
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {item.idealAnswer}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  );
}

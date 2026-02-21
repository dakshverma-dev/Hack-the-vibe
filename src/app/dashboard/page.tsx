'use client';

import { useState } from 'react';
import { ArrowLeft, User, Calendar, Clock, Target, TrendingUp, CheckCircle, XCircle, AlertCircle, Award, Star, Code, MessageSquare, Plus, History, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function InterviewerDashboard() {
  const [view, setView] = useState<'home' | 'past'>('home');

  // Sample interview data
  const interviewData = {
    candidate: {
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      appliedFor: "Senior Software Engineer",
      experience: "5 years"
    },
    interview: {
      date: "September 27, 2025",
      duration: "52 minutes",
      interviewer: "Sarah Mitchell",
      type: "Technical Interview - Data Structures & Algorithms"
    },
    problems: [
      {
        title: "Two Sum",
        difficulty: "Medium",
        solved: true,
        timeSpent: "12 minutes",
        approach: "Hash Map",
        complexity: "O(n)",
        score: 85
      },
      {
        title: "Valid Parentheses", 
        difficulty: "Easy",
        solved: true,
        timeSpent: "8 minutes",
        approach: "Stack",
        complexity: "O(n)",
        score: 92
      },
      {
        title: "Merge Intervals",
        difficulty: "Hard", 
        solved: false,
        timeSpent: "25 minutes",
        approach: "Sorting (Incomplete)",
        complexity: "O(n log n)",
        score: 45
      }
    ],
    overallScore: 74,
    recommendation: "HIRE - Conditional",
    strengths: [
      "Strong problem-solving approach",
      "Good communication skills", 
      "Clean and readable code",
      "Proper time complexity analysis",
      "Asked clarifying questions"
    ],
    weaknesses: [
      "Struggled with advanced algorithms",
      "Could improve edge case handling",
      "Time management on complex problems"
    ],
    detailedFeedback: {
      technical: "Candidate demonstrated solid understanding of fundamental data structures. Code was well-structured and readable. However, faced challenges with the advanced problem requiring optimization.",
      communication: "Excellent communication throughout the interview. Thought process was clear and articulated well. Asked relevant questions and handled feedback positively.",
      problemSolving: "Good analytical thinking for basic to medium problems. Needs improvement in breaking down complex algorithmic challenges into smaller components."
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {view === 'home' ? (
                <Link href="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
              ) : (
                <button onClick={() => setView('home')} className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </button>
              )}
              <div className="h-6 border-l border-white/10"></div>
              <h1 className="text-2xl font-bold text-white">
                {view === 'home' ? 'Interviewer Dashboard' : 'Past Interviews'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Interviewer</p>
                <p className="font-semibold text-white">{interviewData.interview.interviewer}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                SM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Home View - Two Options */}
      {view === 'home' && (
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">What would you like to do?</h2>
            <p className="text-gray-400 text-lg">Create a new interview session or review past results</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Create New Interview */}
            <Link
              href="/practice"
              className="group bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 p-8 flex flex-col items-center text-center space-y-5"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Create New Interview</h3>
                <p className="text-gray-400">Start a new coding interview session with AI-powered questions and real-time feedback.</p>
              </div>
              <div className="flex items-center text-purple-400 font-medium group-hover:gap-2 transition-all">
                <span>Get Started</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            {/* View Past Interviews */}
            <button
              onClick={() => setView('past')}
              className="group bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 p-8 flex flex-col items-center text-center space-y-5"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <History className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">View Past Interviews</h3>
                <p className="text-gray-400">Review previous interview reports, scores, and detailed candidate feedback.</p>
              </div>
              <div className="flex items-center text-blue-400 font-medium group-hover:gap-2 transition-all">
                <span>View Reports</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Past Interviews View - Original Dashboard Content */}
      {view === 'past' && (
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Interview Summary Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Overall Score</p>
                <p className="text-3xl font-bold text-white">{interviewData.overallScore}%</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                interviewData.overallScore >= 80 ? 'bg-green-500/20 text-green-400' :
                interviewData.overallScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 
                'bg-red-500/20 text-red-400'
              }`}>
                <Target className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Problems Solved</p>
                <p className="text-3xl font-bold text-white">
                  {interviewData.problems.filter(p => p.solved).length}/{interviewData.problems.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Duration</p>
                <p className="text-3xl font-bold text-white">{interviewData.interview.duration}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Recommendation</p>
                <p className="text-lg font-bold text-orange-400">{interviewData.recommendation}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Information */}
            <div className="bg-white/5 rounded-lg border border-white/10">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {interviewData.candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{interviewData.candidate.name}</h2>
                    <p className="text-gray-400">{interviewData.candidate.email}</p>
                    <p className="text-sm text-gray-500">{interviewData.candidate.appliedFor} • {interviewData.candidate.experience}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-400">Date:</span>
                    <span className="ml-2 font-medium text-gray-200">{interviewData.interview.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-400">Duration:</span>
                    <span className="ml-2 font-medium text-gray-200">{interviewData.interview.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-400">Interviewer:</span>
                    <span className="ml-2 font-medium text-gray-200">{interviewData.interview.interviewer}</span>
                  </div>
                  <div className="flex items-center">
                    <Code className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-400">Type:</span>
                    <span className="ml-2 font-medium text-gray-200">{interviewData.interview.type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Problems Solved */}
            <div className="bg-white/5 rounded-lg border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Problems & Performance</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {interviewData.problems.map((problem, index) => (
                    <div key={index} className="border border-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            problem.solved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {problem.solved ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{problem.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {problem.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">{problem.score}%</p>
                          <p className="text-sm text-gray-500">{problem.timeSpent}</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                        <div>
                          <span className="font-medium text-gray-300">Approach:</span> {problem.approach}
                        </div>
                        <div>
                          <span className="font-medium text-gray-300">Complexity:</span> {problem.complexity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="bg-white/5 rounded-lg border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Detailed Feedback</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-2 flex items-center">
                    <Code className="w-4 h-4 mr-2 text-purple-400" />
                    Technical Skills
                  </h4>
                  <p className="text-gray-400">{interviewData.detailedFeedback.technical}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-400" />
                    Communication
                  </h4>
                  <p className="text-gray-400">{interviewData.detailedFeedback.communication}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-green-400" />
                    Problem Solving
                  </h4>
                  <p className="text-gray-400">{interviewData.detailedFeedback.problemSolving}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Strengths */}
            <div className="bg-white/5 rounded-lg border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Strengths
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {interviewData.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white/5 rounded-lg border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-orange-400" />
                  Areas for Improvement
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {interviewData.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 rounded-lg border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                  Schedule Follow-up
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                  Send Feedback Email
                </button>
                <button className="w-full border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-300 py-2 px-4 rounded-lg transition-colors font-medium">
                  Download Report
                </button>
                <Link href="/practice" className="block w-full bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-lg transition-colors font-medium text-center">
                  Start New Interview
                </Link>
              </div>
            </div>

            {/* Rating Summary */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Overall Assessment</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Technical Skills</span>
                  <div className="flex items-center">
                    {[1,2,3,4].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                    <Star className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Communication</span>
                  <div className="flex items-center">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Problem Solving</span>
                  <div className="flex items-center">
                    {[1,2,3].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                    <Star className="w-4 h-4" />
                    <Star className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

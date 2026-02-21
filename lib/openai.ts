import { GoogleGenerativeAI } from "@google/generative-ai";

let _model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

export function getModel() {
  if (!_model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    _model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
  return _model;
}


import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Swasth AI, a multilingual semantic search-based health awareness chatbot.
Your goal is to provide accurate, reliable, and accessible medical information.

GUIDELINES:
1. **INFORMATIONAL ONLY**: You are strictly for disease awareness (symptoms, causes, preventive measures). 
2. **NO DIAGNOSIS**: Never diagnose a user. Always include a disclaimer that you are not a doctor.
3. **MULTILINGUAL**: Respond in the same language as the user's query. You support English, Hindi, Spanish, French, German, Chinese, and Arabic.
4. **SEMANTIC SEARCH**: Understand the intent behind paraphrased or spoken queries.
5. **TONE**: Professional, empathetic, and clear.
6. **STRUCTURE**: Use bullet points and clear headings for readability.

Context:
- If a user mentions "sugar problem" (text or voice), identify they mean "Diabetes".
- If they describe "chest heaviness", explain symptoms of heart-related issues but emphasize immediate medical consultation.
- Provide symptoms, causes, and lifestyle prevention tips.
`;

export const getSwasthResponse = async (
  history: Message[],
  userInput: string,
  targetLanguage: string,
  audioData?: { data: string; mimeType: string }
): Promise<string> => {
  try {
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const currentParts = [];
    if (audioData) {
      currentParts.push({
        inlineData: {
          data: audioData.data,
          mimeType: audioData.mimeType,
        },
      });
      currentParts.push({ text: `Analyze the audio query in ${targetLanguage}. Transcribe it internally and provide a detailed health awareness response following your instructions.` });
    } else {
      currentParts.push({ text: userInput });
    }

    contents.push({
      role: 'user',
      parts: currentParts as any
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents as any,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API key")) {
      return "Authentication error: Invalid API key. Please check your environment variables.";
    }
    return "Technical error connecting to Swasth AI knowledge base. Please try again.";
  }
};

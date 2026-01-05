
import { GoogleGenAI, Type } from "@google/genai";
import { ContentType, DetectionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const DETECTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isAI: {
      type: Type.BOOLEAN,
      description: "Whether the content is likely AI-generated or manipulated."
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence level from 0 to 100."
    },
    reasons: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Detailed observations supporting the detection."
    },
    artifacts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Specific visual or structural anomalies detected."
    },
    summary: {
      type: Type.STRING,
      description: "A concise professional summary of the findings."
    }
  },
  required: ["isAI", "confidence", "reasons", "artifacts", "summary"]
};

export const analyzeContent = async (
  type: ContentType,
  data: string | { base64: string; mimeType: string }
): Promise<DetectionResult> => {
  const modelName = 'gemini-3-flash-preview';

  let systemInstruction = "";
  let contents: any;

  if (type === ContentType.TEXT) {
    systemInstruction = `You are an expert forensic linguist specializing in detecting AI-generated text. 
    Analyze the text for LLM hallmarks: repetitive phrasing, lack of nuanced personal experience, 
    overly balanced arguments, specific transition words (delve, underscore, comprehensive), 
    and robotic tone. Return a structured JSON analysis.`;
    contents = {
      parts: [{ text: `Analyze this text for AI-generation signatures: \n\n${data}` }]
    };
  } else if (type === ContentType.AUDIO) {
    systemInstruction = `You are a specialized audio forensic engineer. 
    Examine the provided audio for signs of AI speech synthesis (TTS) or voice cloning:
    1. Lack of natural intake of breath.
    2. Unnatural cadence or lack of emotional variation (monotone delivery).
    3. Spectral artifacts or digital clipping typical of neural vocoders.
    4. Perfect silence between words (lack of room tone/ambience).
    5. Sudden discontinuities in frequency range.
    Return a structured JSON analysis.`;

    if (typeof data !== 'string') {
      contents = {
        parts: [
          { inlineData: { data: data.base64, mimeType: data.mimeType } },
          { text: `Analyze this audio clip for signs of synthetic generation, voice cloning, or deepfake manipulation.` }
        ]
      };
    }
  } else {
    systemInstruction = `You are a world-class digital forensics expert specializing in Deepfake and synthetic media detection. 
    Examine the provided ${type === ContentType.IMAGE ? 'image' : 'video frame'} for:
    1. GAN/Diffusion artifacts (mismatched eyes, weird fingers, skin smoothness).
    2. Frequency analysis anomalies (blurred background transitions).
    3. Lighting/Shadow inconsistencies.
    4. Neural rendering signatures.
    Return a structured JSON analysis.`;

    if (typeof data !== 'string') {
      contents = {
        parts: [
          { inlineData: { data: data.base64, mimeType: data.mimeType } },
          { text: `Scan this ${type === ContentType.IMAGE ? 'image' : 'video content'} for synthetic manipulation or AI generation artifacts.` }
        ]
      };
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: DETECTION_SCHEMA,
        temperature: 0.1,
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as DetectionResult;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    throw new Error(error.message || "Failed to analyze content.");
  }
};

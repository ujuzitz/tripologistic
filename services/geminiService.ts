
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLogisticsInsights = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following logistics data and provide 3 key insights regarding efficiency, risk, and financial health: ${JSON.stringify(data)}`,
      config: {
        systemInstruction: "You are a senior supply chain analyst specializing in China-Africa trade routes.",
        temperature: 0.7,
      }
    });
    // Access response.text as a property
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at this time.";
  }
};

export const parseScanImage = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      // Wrap multiple parts in a contents object as per SDK requirements
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Extract shipping label details: tracking number, weight, customer name, and destination. Return as JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trackingNumber: { type: Type.STRING },
            weight: { type: Type.NUMBER },
            customerName: { type: Type.STRING },
            destination: { type: Type.STRING }
          }
        }
      }
    });
    // Access response.text as a property
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("OCR Error:", error);
    return null;
  }
};

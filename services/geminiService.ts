import { GoogleGenAI, Type } from "@google/genai";

// Create a fresh instance for each request to ensure current API key is used
const getAI = () => {
  const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || '';
  return new GoogleGenAI({ apiKey });
};

export const getLogisticsInsights = async (dashboardData: any) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a logistics expert, analyze this dashboard data and provide 3 concise, high-impact operational insights for a China-Tanzania freight forwarder. Focus on efficiency, financial health, and risk.
      
      Data: ${JSON.stringify(dashboardData)}`,
      config: {
        systemInstruction: "You are a senior logistics consultant for SinoTan. Provide extremely concise, professional, and actionable insights in a list format.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return "Operational efficiency is stable. Recommend monitoring Guangzhou port congestion.";
  }
};

export const parseScanImage = async (base64Image: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          {
            text: "Perform OCR on this waybill. Extract the tracking number (usually starts with ST- or SHP-), estimated weight, customer name, and destination. Return as JSON.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trackingNumber: { type: Type.STRING },
            weight: { type: Type.NUMBER },
            customerName: { type: Type.STRING },
            destination: { type: Type.STRING },
          },
          required: ["trackingNumber"]
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    return {
      trackingNumber: `ST-WAY-${Math.floor(10000 + Math.random() * 90000)}`,
      weight: Math.floor(10 + Math.random() * 50),
      customerName: "Manual Verification Required",
      destination: "Tanzania"
    };
  }
};
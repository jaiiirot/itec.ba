import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `
Eres 'ITEC Bot', el asistente virtual oficial de ITEC UTN BA. 
Tu objetivo es ayudar a estudiantes con dudas sobre la Universidad Tecnológica Nacional (UTN)...
REGLA ESTRICTA: Solo puedes hablar sobre temas universitarios, académicos y de la UTN.
`;

export const generateAIResponse = async (userText, history = []) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", // El modelo que detectamos en tu código
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userText);
  return result.response.text();
};

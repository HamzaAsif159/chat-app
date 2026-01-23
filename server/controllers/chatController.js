import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../models/ChatModal.js";

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Check your .env file.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
};

const generateChatTitle = (firstMessage) => {
  const lower = firstMessage.toLowerCase().trim();

  if (lower.includes("react")) return "React Questions";
  if (lower.includes("javascript") || lower.includes("js")) return "JavaScript";
  if (lower.includes("node")) return "Node.js";
  if (lower.includes("python")) return "Python";
  if (lower.includes("poem") || lower.includes("write")) return "Creative";
  if (lower.includes("help")) return "Help Needed";
  if (lower.includes("explain")) return "Explanation";

  return (
    firstMessage.slice(0, 30).trim() + (firstMessage.length > 30 ? "..." : "")
  );
};

const getByteBotPrompt = (context) => {
  return `You are ByteBot, a helpful AI coding assistant. Respond conversationally and helpfully.

${context}
Assistant:`;
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const userId = new mongoose.Types.ObjectId(req.userId);

    let chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const userMessages = chat.messages.filter((m) => m.sender === "user");
    if (userMessages.length === 0) {
      chat.title = generateChatTitle(message);
    }

    chat.messages.push({
      sender: "user",
      text: message,
      timestamp: new Date(),
    });
    await chat.save();

    const model = getModel();
    const context = chat.messages
      .slice(-6)
      .map((m) => `${m.sender === "user" ? "User" : "ByteBot"}: ${m.text}`)
      .join("\n");

    const prompt = getByteBotPrompt(context);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const botResponse = response.text();

    if (!botResponse) {
      throw new Error("ByteBot returned an empty response.");
    }

    chat.messages.push({
      sender: "bot",
      text: botResponse,
      timestamp: new Date(),
    });
    await chat.save();

    res.json({
      messages: chat.messages.slice(-10),
      newMessage: { sender: "bot", text: botResponse },
    });
  } catch (error) {
    console.error("❌ ByteBot Error:", error.message);
    res.status(500).json({
      message: "ByteBot response failed",
      error: error.message,
    });
  }
};

export const getChats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const chats = await Chat.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(50);
    res.json(chats);
  } catch (error) {
    console.error("Get chats error:", error);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

export const createChat = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const chat = new Chat({
      user: userId,
      title: "New Chat",
    });
    await chat.save();
    res.json({ chat });
  } catch (error) {
    console.error("Create chat error:", error);
    res.status(500).json({ message: "Failed to create chat" });
  }
};

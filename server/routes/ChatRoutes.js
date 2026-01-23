// backend/routes/chat.js
import express from "express";
import { sendMessage, getChats, createChat } from "../controllers/chatController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/send", verifyToken, sendMessage);
router.get("/send", verifyToken, sendMessage);
router.get("/chats", verifyToken, getChats);
router.post("/create", verifyToken, createChat);

export default router;

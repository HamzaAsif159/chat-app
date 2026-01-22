import express from "express";
import { getUserInfo, updateUserInfo } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/me", verifyToken, getUserInfo);
router.put("/me", verifyToken, updateUserInfo);

export default router;

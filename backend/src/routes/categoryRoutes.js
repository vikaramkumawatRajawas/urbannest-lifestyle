import express from "express";
import { getCategories, getCategoryBySlug } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/categories/:slug", getCategoryBySlug);

export default router;

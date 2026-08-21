import express from "express";
import { getApprovedTestimonials } from "../controllers/testimonialController.js";

const router = express.Router();

router.get("/testimonials", getApprovedTestimonials);

export default router;

import express from "express";
import { subscribeNewsletter } from "../controllers/newsletterController.js";

const router = express.Router();

router.post("/newsletter/subscribe", subscribeNewsletter);

export default router;

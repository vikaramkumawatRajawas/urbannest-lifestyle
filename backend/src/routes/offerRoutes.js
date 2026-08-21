import express from "express";
import { getActiveOffers } from "../controllers/offerController.js";

const router = express.Router();

router.get("/offers", getActiveOffers);

export default router;

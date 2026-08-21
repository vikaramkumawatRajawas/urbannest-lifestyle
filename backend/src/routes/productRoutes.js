import express from "express";
import {
  getProducts,
  getFeaturedProducts,
  getProductById
} from "../controllers/productController.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/featured", getFeaturedProducts);
router.get("/products/:id", getProductById);

export default router;

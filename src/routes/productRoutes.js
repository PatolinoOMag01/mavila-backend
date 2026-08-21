import express from "express";

import {
  getProductBySlug,
} from "../controllers/productController.js";

const router = express.Router();

router.get(
  "/:slug",
  getProductBySlug
);

export default router;
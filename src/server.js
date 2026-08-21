import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message:
      "API MAVILA funcionando 🚀",
  });
});

app.get(
  "/api/test-db",
  async (req, res) => {
    try {
      const [result] =
        await db.query(
          "SELECT 1 AS conectado"
        );

      res.json({
        success: true,
        result,
      });
    } catch (error) {
      console.error(
        "ERRO COMPLETO:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Erro ao conectar no banco.",
        error:
          error?.message ||
          String(error),
        code:
          error?.code || null,
      });
    }
  }
);

app.use(
  "/api/produtos",
  productRoutes
);

const PORT =
  process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `Servidor rodando em http://localhost:${PORT}`
  );
});
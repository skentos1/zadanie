import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Importovanie balíka cors
dotenv.config();

import apiKeyAuth from "./middleware/auth.js";
import kurzyRouter from "./routes/kurzy.js";

const app = express();
const PORT = process.env.PORT || 3000;

console.log(process.env.API_KEY);

app.use(
  cors({
    origin: "http://localhost:5173", // Povolenie frontendu bežiaceho na tomto porte
  })
);

app.use(apiKeyAuth);

app.use("/kurzy", kurzyRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

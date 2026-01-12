import "dotenv/config";
import cors from "cors";
import express from "express";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// app.use((req, res, next) => {
//   console.log("I am a middleware");
//   next();
// });

app.use(cors());
app.use(ratelimiter);

app.use("/api/notes", notesRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`);
  });
});

import express from "express";
import notesRoute from "./routes/note.route.js";
import authRoute from "./routes/auth.route.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

if(process.env.NODE_ENV !== "production") {
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }))
}

app.use(express.json());
app.use(cookieParser());

app.use("/api/notes", notesRoute);
app.use("/api/auth", authRoute)

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT);
  });
});

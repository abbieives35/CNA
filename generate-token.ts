// generate-token.ts
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const token = jwt.sign({ id: "1" }, process.env.JWT_SECRET || "default_secret");
console.log("JWT:", token);


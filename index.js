import express from "express";
import { generateUploadUrl } from "./controller/upload.controller.js";
import { findUserIdMiddleware } from "./middleware/findUserId.js";
import { validate } from "./middleware/validationMiddleware.js";
import { generateUploadUrlSchema } from "./validation/uploadValidator.js";
import { config } from 'dotenv';
config();

const app = express();
const PORT=process.env.PORT||5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/generate-upload-url", findUserIdMiddleware, validate(generateUploadUrlSchema), generateUploadUrl);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
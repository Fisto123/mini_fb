 import express from 'express';
import { upload } from '../controllers/upload.js';
const router = express.Router();
 router.post("/api/upload", upload);

 export default router
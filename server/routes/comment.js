import express from 'express';
import { addComment, getComment, getCommentUser } from '../controllers/comment.js';
import { auth } from '../middleware/verify.js';
const router = express.Router();
router.post(
'/api/commentPost/:id', auth, addComment

)
router.get(
'/api/getComments/:id', auth, getComment

)
router.get(
'/api/getCommentsUser/:id', auth, getCommentUser

)
export default router
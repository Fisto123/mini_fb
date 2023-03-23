import express from 'express';
import { createPost, deletePost, dislikePost, getAllPosts, getTimelinePosts, getUserPost, likePost, likePosts, updatePost } from '../controllers/Post.js';
import { upload } from '../controllers/upload.js';
import { verifyTokenAndAdmin } from '../middleware/verify.js';
import { auth } from '../middleware/verify.js';
const router = express.Router();
router.post(
'/api/createPost', auth, createPost

)
router.put(
'/api/updatePost/:id', auth, updatePost

)
router.delete(
'/api/deletePost/:id', auth, deletePost

)
router.get(
'/api/getPosts',auth, getAllPosts

)

router.put(
'/api/likePost/:id',auth, likePost

)
router.get(
'/api/timelinePosts/:id',auth, getTimelinePosts

)
router.get(
'/api/getSinglePost/:id', auth, getUserPost

)
router.put(
'/api/likePosts/:id', auth, likePosts

)
router.put(
'/api/dislikePosts/:id', auth, dislikePost

)
 router.post("/upload", upload);
export default router
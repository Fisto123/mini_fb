import commentModel from '../models/comments.js'
import Post from '../models/Post.js'
import User from '../models/userModel.js'
export const addComment = async(req,res) => {
    let comment = req.body
      try {
        const post = await Post.findById(req.params.id)
        if(!post)return res.status(404).json({msg:'posts doesnt exist'})
           const comments =  new commentModel({
            ...comment,
            postId:post._id,
            name:req.user.name,
            userId:req.user.id,
            image:req.user.image
           })
           const savedComment = await comments.save();
           return res.status(200).send(savedComment)
      } catch (error) {
          res.status(404).json({msg:error.message})
      }

}
export const getComment = async(req,res) => {
      try {
          //GET ALL COMMENTS OF A post
           const post = await Post.findById(req.params.id)
           if(!post)return res.status(404).json({msg:'post doesnt exist'})
          const posts = await commentModel.find({postId:post._id})
        res.status(200).json(posts)
      } catch (error) {
        res.status(404).json({msg:error.message})
      }

}
export const getCommentUser = async(req,res) => {
      try {
          //GET ALL COMMENTS OF A post
           const comments = await commentModel.findById(req.params.id)
           if(!comments)return res.status(404).json({msg:'comment doesnt exist'})
          const users = await User.findById(comments.userId)
        res.status(200).json(users)
      } catch (error) {
        res.status(404).json({msg:error.message})
      }

}



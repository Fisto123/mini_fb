import Post from "../models/Post.js"
import User from '../models/userModel.js'
export const createPost= async(req,res) => {
    //create video

    const newPost = req.body
      try {
        //THIS ALLOWS ME TO POST  WITH MY USER ID INFORMATION  TO KNOW THAT ITS MINE
    const savedPost = new Post({
        ...newPost,
        userId:req.user.id
    })
         const post = await savedPost.save()
          res.status(200).json(post)
      } catch (err) {
         //catch error
        res.json({msg:err.message})
      }

}
export const updatePost = async(req,res) => {
    //update post
    const post = await Post.findById(req.params.id)
    if(!post) res.status(404).json({msg:'post doesnt exist'})
     if(post.userId === req.user.id || req.user.admin){
      //todo
      const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedPost)
      }
      else{
         return res.status(403).json('you are not authorized to update this post details')
      }
}
export const getUserPost = async(req,res) => {
     try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(500).json({msg:'USER DOES NOT EXIST'})
        }
         const posts = await Post.find({userId:user._id})
        res.status(200).json(posts.flat().sort((a,b)=>b.createdAt-a.createdAt))
     } catch (error) {
        return res.status(500).json({msg:error.message})
     } 
}
export const deletePost = async(req,res) => {
    //update post
    const post = await Post.findById(req.params.id)
    if(!post) res.status(404).json({msg:'post doesnt exist'})
     if(post.userId === req.user.id || req.user.admin){
      //todo
      await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({msg:'post deleted'})
      }
      else{
         return res.status(403).json('you are not authorized to delete this post details')
      }
}

export const getAllPosts = async(req,res)=>{
    const query = req.query.new;
    if(req.user.id){
     try {
    const posts = query
      ? await Post.find().sort({ _id: -1 })
      : await Post.find();
    return res.status(200).json(posts);
  } catch (error) {
         return res.status(500).json({msg:'you need to be logged in'})
    }
    }
     else  {
         return res.status(500).json({msg:error.message})
    }
}
export const getSinglePost= async(req,res) => {
    //get single post
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({msg:error.message})
    }

}
export const likePost= async(req,res) => {
    //like/dislike post
   const post = await Post.findById(req.params.id)
   try {
     if(!post.likes.includes(req.body.userId)){
        await post.updateOne({$push:{likes:req.body.userId}})
         res.status(200).json({msg:'post have been liked'})
     }else{
        await post.updateOne({$pull:{likes:req.body.userId}})
        res.status(200).json({msg:'post have been disliked'})
     }
   } catch (error) {
    res.status(500).json(error)
   }
}
//get my post and friends post
export const getTimelinePosts = async(req,res)=>{
    try {
         const currentUser = await User.findById(req.params.id)
         const userPosts = await Post.find({userId:currentUser._id})
         const friendsPost = await Promise.all(
            currentUser.following.map(friendId=>{
                return Post.find({userId:friendId})
            })
         )
          
         const sortedPost= (userPosts.concat(...friendsPost))
         res.status(200).json(sortedPost.flat().sort((a,b)=>b.createdAt-a.createdAt))

    } catch (error) {
         res.status(500).json(error)
    }
}

export const likePosts= async(req,res,next) => {
         const id = req.user.id;
         const postId = req.params.id
    try {
           await Post.findByIdAndUpdate(postId,{
            $addToSet:{likes:id},
            $pull:{dislikes:id},
           })
           res.status(200).json('The post has been liked')
     } catch (error) {
       res.status(500).json(error)
     } 

}
export const dislikePost = async(req,res) => {
         const id = req.user.id;
         const postId = req.params.id
     try {
           await Post.findByIdAndUpdate(postId,{
            $addToSet:{dislikes:id},
            $pull:{likes:id},
           })
           res.status(200).json('The post has been disliked')
     } catch (error) {
      res.status(500).json(error)
     } 

}
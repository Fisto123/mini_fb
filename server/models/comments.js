import mongoose from "mongoose";

const commentSchema =  mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    name:{
     type:String
    },
      postId:{
        type:String,
        required:true,
    },
    desc:{
         type:String,
        required:true,
    },
    image:{
       type:String 
    }

}, {timestamps: true })
export default mongoose.model('Comment',commentSchema)
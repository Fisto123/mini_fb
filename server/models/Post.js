import mongoose  from "mongoose";

const PostSchema = new mongoose.Schema({
    userId:{
        type:String,
        trim:true
    },
       desc:{
        type:String,
        required:[true,"please enter your desc"],
        trim:true,
        max:500
    },
       image:{
        type:String
    },
    hobbies:{
        type:String
    },
    profileImage:{
          type:String
    },
     likes:{
        type:Array,
        default:[]
    },
      dislikes:{
        type:Array,
        default:[]
    }
},{timestamps:true})
export default mongoose.model('Post',PostSchema)
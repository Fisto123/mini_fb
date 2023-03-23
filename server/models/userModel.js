import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:[true,"please enter your first name"],
        trim:true
    },
     surname:{
        type:String,
        required:[true,"please enter your surname"],
        trim:true
    },
    dateOfBirth:{
      type:String,
    required:[true,"please enter your date of birth"],
    },
       email:{
        type:String,
        required:[true,"please enter your email"],
        trim:true,
        unique:true
    },
       password:{
        type:String,
        required:[true,"please enter your password"],
        trim:true
    },
     address:{
        type:String,
        trim:true
    },
    gender:{
        type:String
    },
    coverPicture:{
        type:Array,
        default:[]
    },
    profileImage:{
        type:Array,
        default:[]
    },
    followers:{
        type:Array,
        default:[]
    },
      following:{
        type:Array,
        default:[]
    },
    desc:{
     type:String,
     max:50
    },
     city:{
     type:String,
     max:50
    },
    from:{
     type:String,
     max:50
    },
    relationship:{
     type:String,
    },
    admin:{
        type:Boolean,
        default:false
    },
     superadmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
export default mongoose.model('Users',userSchema)
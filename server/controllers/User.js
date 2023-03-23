import Users from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../sendEmail.js'
import dotenv from 'dotenv';
import ValidatePassword from 'validate-password';
const validator = new ValidatePassword();
dotenv.config()
const {BASE_URL} = process.env
export const register = async(req,res)=>{
    try {
        const {email,password,dateOfBirth,firstname,gender,surname}= req.body
             if( !email)
            return res.status(400).json({msg:'please fill in email'})
        if( !dateOfBirth)
            return res.status(400).json({msg:'please fill in your date of Birth'})
        if( !firstname)
            return res.status(400).json({msg:'please fill in firstname'})
             if( !surname)
            return res.status(400).json({msg:'please fill in surname'})
        if( !gender)
            return res.status(400).json({msg:'please fill in your gender'})
            const passwordData = validator.checkPassword(password);
            if (!passwordData.isValid) {
                return res.status(400).json({msg:passwordData.validationMessage})
            }
        if(!validateEmail(email))
          return res.status(400).json({msg:'invalid email'}) 
        const user = await Users.findOne({email})
        if(user)return res.status(400).json({msg:'this email already exists'})

        if(password.length<6)return res.status(400).json({msg:'Password must be more than 6 characters'})
         

        const passwordHash = await bcrypt.hash(password,12)

        const newUser =  {
            ...req.body,
            password:passwordHash
        }
      const activation_token = createActivationToken(newUser)
      
      const url = `${BASE_URL}/user/activate/${activation_token}`
      sendEmail(email,url,'verify your email')
     return res.json({msg:'verification link has been sent to your mail'})


    } catch (err) {
        return res.status(500).json({msg:err.message}) 
    }
}
export const verifyEmail = async(req,res)=>{
    try {
        const {activation_token}=req.body
        const user = jwt.verify(activation_token,process.env.ACTIVATION_CODE)
        if(!user)return res.json({msg:'invalid token'})
        const {firstname,dateOfBirth,gender,email,password,surname}= user
        const check = await Users.findOne({email})
        if (check) return res.status(400).json({msg:'Account has already been verified'})
        const newUserz = new Users({
             email,password,dateOfBirth,firstname,gender,surname
        })
        await newUserz.save();
        res.json({msg:'Account has been activated'})
    } catch (error) {
         return res.status(500).json({msg:error.message}) 
    }
}

export const login = async(req,res)=>{
    try {
        const {email}= req.body
        if( !email)
            return res.status(400).json({msg:'please fill in email'})
        if( !req.body.password)
            return res.status(400).json({msg:'please fill in your password'})
        const user = await Users.findOne({email})
        if (!user)  return res.status(400).json({msg:'This email does not exist'})
        const isMatched = await bcrypt.compare(req.body.password,user.password)
        if(!isMatched) return res.status(400).json({msg:'password incorrect'})
         const accessToken = jwt.sign(
      {
        id: user._id,
        name:user.firstname,
        admin: user.admin,
        email:user.email,
        surname:user.surname,
        superadmin:user.superadmin
      },
      process.env.JWT,
      {expiresIn:"3d"}
    );
     let { password, ...others } = user._doc;
    res.status(200).json({...others, accessToken});
    } catch (error) {
        res.status(404).json(error);
    }
}
export const forgotPassword = async(req,res)=>{
    const {email}= req.body;
    const user = await Users.findOne({email})
    if (!user) return res.status(400).json({msg:'this email does not exists'})
     const activation_token = createActivationToken({id:user._id})
      
      const url = `${BASE_URL}/user/reset/${activation_token}`
      if (req.user.email === req.body.email) {
         sendEmail(email,url,'reset your email')
          res.status(500).json({msg:'Resend your password,please check your email to reset your account'})
      }
     return res.status(500).json({msg:'You can only access your own account'})
}
const validateEmail = (email) => {
    const re =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
} 
export const resetPassword = async(req,res)=>{
    try {
        const {password}=req.body;
        const passwordHash= await bcrypt.hash(password,12)
        await Users.findOneAndUpdate({_id:req.user.id},{
            password:passwordHash
        })
        if (req.user.email === req.body.email) {
            return res.status(500).json({msg:'password changed successfully'})
        }
         return res.status(500).json({msg:'You can only reset password of your own account'})
    } catch (error) {
        
    }
}
export const getAllUserInfo = async(req,res)=>{
    const query = req.query.new;
     try {
    const users = query
      ? await Users.find().sort({ _id: -1 }).limit(5)
      : await Users.find();
    return res.status(200).json(users);
  } catch (error) {
         return res.status(500).json({msg:error.message})
    }
}

export const getUserInfo = async(req,res)=>{
    if(req.user.id === req.params.id || req.user.admin){
        try {
            const singleUser = await Users.findById(req.params.id)
          return res.status(200).json(singleUser)
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    }
    else{
        return res.status(403).json('you are not authorized to view his details')
      }
}
export const getUser = async(req,res) => {
     try {
         const user = await Users.findById(req.params.id)
         res.status(200).json(user)
     } catch (error) {
        return res.status(500).json({msg:error.message})
     } 

}

export const deleteSingleUser = async(req,res,next) => {
      if(req.params.id === req.user.id ){
      //todo
      try {
         await Users.findByIdAndRemove(req.params.id) 
           res.status(200).json('sucessfully deleted') 
      } catch (error) {
          next(error)
      }
      }
      else{
         return res.status(403).json('you are not authorized to delete his details')
      }

}
export const deleteUserAdmin = async(req,res,next) => {
      if(req.user.admin){
      //todo
      try {
         await Users.findByIdAndRemove(req.params.id) 
           res.status(200).json('sucessfully deleted') 
      } catch (error) {
           return res.status(403).json('you are not authorized to delete his details')
      }
      }
}
export const updateUser = async(req,res) => {
      if(req.params.id === req.user.id || req.user.admin){
      //todo
      try {
         const updatedUser = await Users.findByIdAndUpdate(req.params.id,{
        $set:req.body
       },
       {new:true}
       ) 
           return res.status(200).json(updatedUser) 
      } catch (error) {
          return res.status(200).json('updated deleted') 
      }
      }
      else{
         return res.status(403).json('you are not authorized to update his details')
      }

}
export const updateUserRole = async(req,res,next) => {
      if(req.user.superadmin){
      //todo
      try {
         const updatedUser = await Users.findByIdAndUpdate(req.params.id,{
        $set:req.body
       },
       {new:true}
       ) 
           res.status(200).json(updatedUser) 
      } catch (error) {
          next(error)
      }
      }
      else{
         return res.status(403).json('you are not a superadmin')
      }

}
//follow user 
export const followUser = async(req,res)=>{
    if(req.user.id !== req.params.id){
         try {
            const user  = await Users.findById(req.params.id)
            const currentUser  = await Users.findById(req.body.userId)
           if(!user.followers.includes(req.body.userid)){
              await user.updateOne({$push:{followers:req.body.userId}})
               await currentUser.updateOne({$push:{following:req.params.id}})
               res.status(200).json('user has been followed')

           }else{
            res.status(403).json('you already follow this user')
           }
         } catch (error) {
            return res.status(500).json(error)
         }      
    }else{
        return res.status(403).json('you cant follow yourself')
    }
}
//unfollow User
export const unfollowUser = async(req,res)=>{
   if (req.params.id !== req.body.userId) {
       try {
        const user = await Users.findById(req.params.id)
        const currentUser = await Users.findById(req.body.userId)
        if( user.followers.includes(req.body.userId)  ){
            await user.updateOne({$pull:{followers:req.body.userId}})
            await currentUser.updateOne({$pull:{following:req.params.id}})
            res.status(200).json('user has been unfollowed')

        }else{
          res.status(403).json('you already unfollow this user')
        }
       } catch (error) {
        
       }
   }else{

       return res.status(403).json('you cant unfollow yourself')    
   }
}
export const getFriends = async(req,res)=>{
     const user = await Users.findById(req.params.id)
     if(!user) return res.json({msg:'user doesnt exist'})
     const friends = await Promise.all(
        user.following.map((friendId)=>{
             return Users.findById(friendId)
        })
        )
        let FriendList = [];
        friends.map((friend)=>{
            const {_id,surname,firstname,profileImage}=friend;
            FriendList.push({_id,surname,firstname,profileImage})
        })
        res.status(200).json(FriendList)
}
  
export const suggestFriends = async(req,res)=>{
    const user = await Users.findById(req.params.id)
    if(!user) return res.json({msg:'user doesnt exist'})
  
    const friends = await Promise.all(
        user.following.map((friendId)=>{
            return Users.findById(friendId)
        })
    )
    try {
         let FriendList = []
        friends.map((frd)=>{
            const {following}=frd;
            FriendList.push(following)  
        })
           res.status(200).json(FriendList)
    } catch (error) {
        console.log(error);
    }
        
         
}
    
const createActivationToken = (payload) => {
    return jwt.sign(payload,process.env.ACTIVATION_CODE,{expiresIn:'50m'})
}



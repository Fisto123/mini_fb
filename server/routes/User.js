import express from 'express';
import { auth, verifyTokenAndAdmin, verifyTokenAndSuperadmin } from '../middleware/verify.js';
import { deleteSingleUser, deleteUserAdmin, followUser, forgotPassword, getAllUserInfo, getFriends, getUser, getUserInfo, login, register, resetPassword, suggestFriends, unfollowUser, updateUser, updateUserRole, verifyEmail } from '../controllers/User.js';
const router = express.Router();
router.post(
'/api/signup', register

)
router.post(
'/api/activation', verifyEmail

)
router.post(
'/api/login', login

)
router.post(
'/api/forgotPassword', auth, forgotPassword

)
router.post(
'/api/resetPassword', auth, resetPassword

)
router.get(
'/api/getAllUsers', auth, getAllUserInfo

)
router.get(
'/api/getUser/:id', getUser

)
router.get(
'/api/getMyinfo/:id', auth, verifyTokenAndAdmin, getUserInfo

)
router.delete(
'/api/deleteUser/:id', auth, deleteSingleUser

)
router.delete(
'/api/deleteUserAdmin/:id', verifyTokenAndAdmin, deleteUserAdmin

)
router.patch(
'/api/updateUser/:id',auth, updateUser

)
router.patch(
'/api/updateUserRole/:id',verifyTokenAndSuperadmin, updateUserRole

)
router.put(
'/api/followUser/:id', auth, followUser

)
router.put(
'/api/unfollowUser/:id', auth, unfollowUser

)
// router.put(
//     '/api/followNonFriends/:id',auth,followNonFriends
// )
router.get(
    '/api/getFriends/:id',auth, getFriends
)
router.get(
    '/api/suggestFriends/:id',auth, suggestFriends
)


export default router
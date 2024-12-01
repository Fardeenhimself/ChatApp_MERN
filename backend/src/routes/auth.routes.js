const { httpLoginUser, httpRegisterUser, httpLogoutUser, httpCheckAuth,updateProfilePic } = require('../controllers/auth.controller');
const protectedRoute = require('../middlewares/protected.middleware');

const authRouter=require('express').Router();


authRouter.post('/login',httpLoginUser);
authRouter.post('/register',httpRegisterUser);
authRouter.get('/logout',httpLogoutUser);
authRouter.put('/update-profile',protectedRoute,updateProfilePic);
authRouter.get('/check',protectedRoute,httpCheckAuth);



module.exports=authRouter;
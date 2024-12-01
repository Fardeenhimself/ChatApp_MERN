
const { getUsersforSideBar, httpGetMessages, httpSendMessges } = require('../controllers/message.controller');
const protectedRoute = require('../middlewares/protected.middleware');


const messageRouter=require('express').Router();


messageRouter.get('/users',protectedRoute,getUsersforSideBar);
messageRouter.get('/:id',protectedRoute,httpGetMessages);
messageRouter.post('/send/:id',protectedRoute,httpSendMessges);




module.exports=messageRouter;
const express = require('express');
const auth = require('../middleware/auth');

const blogs = require('./bolg');
const users = require('./user');


const router = express.Router();


router.use('/user', users);
router.use('/blog' , blogs,auth);

module.exports={
    router,
}
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const asyncSign = promisify(jwt.sign);
const User = require('../models/user');

//Register  new user 
const register = (user) => User.create(user);

//login 
const login = async ({ username, password }) => {
  const user = await User.findOne({ username }).exec();

  if (!user) {
    throw Error('UN_AUTHENTICATED');
  }

  const isVaildPass = user.validatePassword(password);
  console.log(isVaildPass)
  if (!isVaildPass) {
    throw Error('UN_AUTHENTICATED');
  }

  const token = await asyncSign({
    username: user.username,
    id: user.id,
  }, 'SECRET_MUST_BE_COMPLEX', { expiresIn: '1d' });
  // var token = jwt.sign({userID: user.id}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
  // res.send({token});
  return { ...user.toJSON(), token };
};


//get all user  
const getAll = () => User.find({}).exec();
//get logined user
const getUser = (id) => User.findById(id);

//user edit his data 
const editUser = (id, data) => User.findByIdAndUpdate(id, data, { new: true }).exec();

//user remove his account  
const removeAcc = (id) => User.findByIdAndDelete(id).exec();
//Add  User to you follwing array 
const addfollowing = (id, targetid) => User.update(
  { "_id": id },
  {
    $addToSet: {
      following: targetid,
    }
  }

);
// //Add you to user  follower array 
const addfollower = (id, targetid) => User.update(
  { "_id": targetid },
  {
    $addToSet: {
      followers: id,
      
    }
    
  }
);


//Remove user from you following array 
const removefollowing = (id, targetid) => User.update(
  { "_id": id },
  {
    $pull: {
      following: targetid,
    }
  }
);
// //Remove  you from follower array 
const removefollower = (id, targetid) => User.update(
  { "_id": targetid },
  {
    $pull: {
      followers: id,
    }
  }
);
//search By id
const getuserById = (id) => User.findById(id).exec();

//serarch By Name
const searchByusername = ({ username }) => User.findOne({ username }).exec();

module.exports = {
  register,
  login,
  getAll,
  editUser,
  removeAcc,
  
  addfollowing,
  addfollower,
  removefollowing,
  removefollower,
  getUser,
  getuserById,
  searchByusername,
};

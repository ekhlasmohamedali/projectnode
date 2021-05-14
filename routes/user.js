const express = require('express');
const {
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
  searchByusername

} = require('../controllers/user');
const auth = require('../middleware/auth')
const router = express.Router();

//register
router.post('/register', async (req, res, next) => {
  const { body } = req;
  try {
    const user = await register(body);
    res.json(user);
  } catch (e) {
    next(e);
  }
});

//login
router.post('/login', async (req, res, next) => {
  const { body } = req;
  try {
    const user = await login(body);
    res.json(user);
  } catch (e) {
    next(e);
  }
});

//get logined user
router.get('/me', auth, async (req, res, next) => {
  try {
    const { user: id } = req;
    const users = await getUser(id);
    res.json(users);
  } catch (e) {
    next(e);
  }
});


//get  user 
router.get('/', auth, async (req, res, next) => {
  try {
    const users = await getAll();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// Edit your data 
router.patch('/edit', auth, async (req, res, next) => {
  const { user: { id }, body } = req;
  try {
    const users = await editUser(id, body);
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// Remove your account 
router.delete('/remove', auth, async (req, res, next) => {
  const { user: { id } } = req;
  try {
    const users = await removeAcc(id);
    res.send("Delete done ");
  } catch (e) {
    next(e);
  }
});


//follow 
router.post('/follow/:userid', auth, async (req, res, next) => {
  const { params: { userid }, user: { id } } = req;
  try {
    if (userid != id) {
      const following = await addfollowing(id, userid);
      const follower = await addfollower(id, userid);
      res.json({ follower, following });
    }

  } catch (e) {
    next(e);
  }
});

//unFollow
router.post('/unfollow/:userid', auth, async (req, res, next) => {
  const { params: { userid }, user: { id } } = req;
  try {
    const userunfollowID = await removefollowing(id, userid);
    const userunfollowIDes = await removefollower(id, userid);
    res.json(`Now you unfollow ${userid}`);
  } catch (e) {
    next(e);
  }
});

//serch by id 
router.get('/search/:_id', auth, async (req, res, next) => {
  const { params: { _id } } = req;
  try {
    const users = await getuserById({ _id });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

//search By name
router.get('/name/:username', auth, async (req, res, next) => {
  const { params: { username } } = req;
  try {
    const user = await searchByusername({ username });
    res.json(user);
    console.log(user);
  } catch (e) {
    next(e);
  }
});


module.exports = router;

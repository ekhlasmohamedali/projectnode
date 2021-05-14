const express = require('express');
const route = express.Router();
const { createblog,
  getAll,
  readById,
  editBlog,
  deleteById,
  searchByTitle,
  searchByTag,
  searchByAuther,
  home,
  searchTageTitle,

} = require('../controllers/blog')
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blogs');
const Comment = require("../models/comment");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'image/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const auth = require('../middleware/auth')


//get all blog
route.get('/all', async (req, res, next) => {
  try {
    const blogs = await getAll();
    res.json(blogs);
  } catch (e) {
    next(e);
  }
});

//Home 
route.get('/home', async (req, res, next) => {
  try {
   
    Blog.find({}).lean().populate('auther').then((blog) => {
      res.json(blog)
    })
  } catch (e) {
    next(e);

  }
})


//to read one blog 
//blog with its comment/
route.get('/one/:_id', auth, async (req, res, next) => {
  const { params: { _id } } = req;
  try {
    const blogs = await readById({ _id });
   
    Blog.findById(req.params._id).lean().populate('comments', 'auther').then((blog) => {
      res.json(blog)
      
    })

  }
  catch (e) {
    next(e);
  }
 
});

route.get('/title/:title', auth, async (req, res, next) => {
  const { params: { title } } = req;
  try {
    const blogs = await searchByTitle({ title });
    res.json(blogs);
  } catch (e) {
    next(e);
  }
});

//search by auther
route.get('/auther/:auther', auth, async (req, res, next) => {
  const { params: { auther } } = req;
  try {
    const blogs = await searchByAuther({ auther });
    res.json(blogs);
  } catch (e) {
    next(e);
  }
});

//search by tag
route.get('/tag/:tag', auth, async (req, res, next) => {
  const { params: { tag } } = req;
  try {
    const blogs = await searchByTag({ tag });
    res.json(blogs);
  } catch (e) {
    next(e);
  }
});

route.post('/add', auth, async (req, res, next) => {
  console.log(req.user);
  const upload = multer({ storage: storage }).single("photo");

  upload(req, res, function (err) {
    console.log(req.user);
    const { body, user: { id } } = req;
    if (req.file != undefined)
      body.photo = req.file.path;
    createblog({ ...body, auther: id }).then(blog => res.json(blog)).catch(e => {
      console.log(e);
      next(e)
    });
  });
});


//get your post 
route.get('/profile', auth, async (req, res, next) => {
  const { user: { id } } = req;
  try {
    const blog = await getAll({ auther: id });
    res.json(blog);

  } catch (e) {
    next(e);

  }
});

//edit one blog 
route.patch('/:_id', auth, async (req, res, next) => {
  const { params: { _id }, body, user: { id } } = req;
  try {
    if ({ auther: id }) {
      const blogs = await editBlog({ _id }, body);
      res.json(blogs);
    } else { res.send("You are not auther") }
  } catch (e) {
    next(e);
  }
});

//Delete one blog 
route.delete('/:_id', auth, async (req, res, next) => {
  const { params: { _id }, user: { id } } = req;
  try {
    const blogs = await deleteById(_id);
    res.send('Delete Done')
  } catch (e) {
    next(e);
  }
});
//search 
route.get('/search/:ser', auth, async (req, res, next) => {
  const { params: { ser } } = req;
  try {
    const blogs = await searchTageTitle({ ser });
    res.json(blogs);
  } catch (e) {
    next(e);
  }
});


//get auther post 
route.get('/searchProfile', auth, async (req, res, next) => {
  const { body: { id } } = req;
  try {
    const blog = await getAll({ auther: id });
    res.json(blog);

  } catch (e) {
    next(e);

  }
});

/////////////////////Add comment  ///////////////////
route.post("/comments/:id", auth, function (req, res) {
  // INSTANTIATE INSTANCE OF MODEL
  const comment = new Comment(req.body);

  
  comment
    .save()
    .then(comment => {
      return Blog.findByIdAndUpdate(req.params.id, { $push: { comments: comment } }, { new: true })
        .populate("comments");
    })
    .then(blog => {
      res.json(blog)

    })

    .catch(err => {
      next(err);
    });
});



module.exports = route;

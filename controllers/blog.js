const Blog = require('../models/blogs');
const User = require('../models/user');


//add new blog
const createblog = (blogs) => Blog.create(blogs);

//get all blog 
const getAll = (query) => Blog.find(query);

//read one blog
const readById = (id) => Blog.findById(id).exec();

//edit your blog 
const editBlog = (id, body) => Blog.findByIdAndUpdate(id, body, { new: true }).exec();


//delete blog
const deleteById = (id) => Blog.findByIdAndDelete(id).exec();


//search by title
const searchByTitle = ({ title }) => Blog.find({ title }).exec();

//search by tag 
const searchByTag = ({ tag }) => Blog.find({ tag }).exec();

//search by auther
const searchByAuther = ({ auther }) => Blog.find({ auther }).exec();

//home to display blog sorted
const home = () => Blog.find().sort([[' createdAt', -1]]).exec()


const searchTageTitle = async ({ ser }) => {
    const user = await User.find({ username: new RegExp(ser, 'i') }, { _id: 1 }).exec();
    console.log(user);
    return Blog.find({ $or: [{ tag: new RegExp(ser, 'i') }, { title: new RegExp(ser, 'i') }, { auther: { $in: user } }] }).exec();


}


module.exports = {
    createblog,
    getAll,
    readById,
    editBlog,
    deleteById,
    searchByTitle,
    searchByTag,
    searchByAuther,
    home,
    searchTageTitle,
}
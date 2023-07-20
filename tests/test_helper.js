const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Title 1',
    author: 'Author 1',
    url: 'google.com',
    likes: 69
  },
  {
    title: 'Title 2',
    author: 'Author 2',
    url: 'google.com',
    likes: 10
  },
  {
    title: 'Title 3',
    author: 'Author 3',
    url: 'nolikes.com',
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { initialBlogs, blogsInDb, usersInDb }
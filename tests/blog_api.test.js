const supertest = require('supertest')
const app = require('../app')
const helper = require('../tests/test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('User creating tests', () => {
  test('Creating an user', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = {
      username: 'Just a ',
      name: 'Testaus',
      password: 'Test'
    }
    const result = await api.post('/api/users')
      .send(user)
      .expect(201)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    await User.findByIdAndDelete(result.body.id)
  })

  test('Name must be unique', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = {
      username: 'Testi',
      name: 'John cena',
      password: 'Hello'
    }
    await api.post('/api/users')
      .send(user)
      .expect(400)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('Name must be at least 3 characters', async () => {
    const newUser = {
      username: '',
      name: 'longer',
      password: 'Heippa'
    }
    await api.post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('Password must be at least 3 characters', async () => {
    const newUser = {
      username: 'Longer',
      name: 'longer',
      password: 'He'
    }
    await api.post('/api/users')
      .send(newUser)
      .expect(400)
  })
})

describe('Login tests', () => {
  test('Login works with a valid user', async () => {
    const user = {
      username: 'Testuser',
      password: 'Test'
    }
    await api.post('/api/login')
      .send(user)
      .expect(200)
  })

  test('Login with wrong username', async () => {
    const user = {
      username: 'Wrong',
      password: 'Test'
    }
    await api.post('/api/login')
      .send(user)
      .expect(401)
  })

  test('Login with wrong password', async () => {
    const user = {
      username: 'Testi',
      password: 'Wrong'
    }
    await api.post('/api/login')
      .send(user)
      .expect(401)
  })
})

describe('Blog tests', () => {
  let token, user

  beforeAll(async () => {
    const result = await api.post('/api/login')
      .send({ username: 'Testuser', password: 'Test' })
    token = result.body.token
    const users = await helper.usersInDb()
    user = users[0]
    await Blog.deleteMany({})
    for (let blog of helper.initialBlogs) {
      const newBlog = new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        user: user.id
      })
      await newBlog.save()
    }
  })

  test('Returns correct amount of blogs', async () => {
    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  test('ID is defined', async () => {
    const blogs = await helper.blogsInDb()
    expect(blogs[0].id).toBeDefined()
  })

  test('Can add with valid token', async () => {
    const blog = {
      title: 'Test blog',
      author: 'Testor',
      url: 'google.com',
      likes: 20,
      user: user.id
    }
    await api.post('/api/blogs')
      .set('authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
  })

  test('Can not add without a valid token', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blog = {
      title: 'Test blogg',
      author: 'Testor',
      url: 'google.com',
      likes: 20,
      user: user.id
    }
    await api.post('/api/blogs')
      .set('authorization', `Bearer ${token}1`)
      .send(blog)
      .expect(400)
      .expect('{"error":"token missing or invalid"}')

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength( blogsAtStart.length)
  })

  test('Title or author missing fails', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogWithoutTitle = {
      title: '',
      author: 'Testor',
      url: 'google.com',
      likes: 20,
      user: user.id
    }
    const blogWithoutAuthor = {
      title: 'Without url',
      author: '',
      url: 'google.com',
      likes: 20,
      user: user.id
    }
    await api.post('/api/blogs')
      .set('authorization', `Bearer ${token}`)
      .send(blogWithoutAuthor)
      .expect(400)

    await api.post('/api/blogs')
      .set('authorization', `Bearer ${token}`)
      .send(blogWithoutTitle)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('Likes default to 0', async () => {
    const blog = new Blog({
      title: 'Test blogg',
      author: 'Testor',
      url: 'google.com',
      user: user.id
    })
    await blog.save()
    const blogs = await helper.blogsInDb()
    expect(blogs[blogs.length - 1].likes).toBe(0)
  })

  test('Delete a blog with valid token', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blog = blogsAtStart[blogsAtStart.length - 1]

    await api.delete(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  })

  test('Updating likes', async () => {
    const blogs = await helper.blogsInDb()

    const blog = blogs[blogs.length - 1]

    await api.put(`/api/blogs/${blog.id}`)
      .set('authorization', `Bearer ${token}`)
      .send({ likes: 1000 })
      .expect(200)
    const updatedBlogs = await helper.blogsInDb()
    const newBlog = updatedBlogs[updatedBlogs.length - 1]
    expect(newBlog.likes).toBe(100)
  })
})
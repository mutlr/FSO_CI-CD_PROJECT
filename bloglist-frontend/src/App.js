import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Message from './components/Message'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const updateList = async () => {
    const response = await blogService.getAll()
    setBlogs( response.sort((a, b) => b.likes - a.likes))
  }

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs.sort((a, b) => b.likes - a.likes))
    }).catch(err => console.log(err))
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setMessage(null)
      setError(null)
    }, 3000)
  }, [message])

  const handleLogin = async (username, password) => {
    try {
      const response = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(response))
      setUser(response)
      blogService.setToken(response)
    } catch (error) {
      setMessage('Invalid username or password')
      setError(true)
      console.log(error)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleLike = async (blog) => {
    try {
      await blogService.updateLike(blog)
      updateList()
    } catch (error) {
      console.log(error)
    }
  }
  const createBlog = async (blog) => {
    try {
      await blogService.createBlog(blog)
      updateList()
      setMessage(`Added ${blog.title} by ${blog.author}`)
    } catch (error) {
      console.log(error)
      setError(true)
      setMessage('Title or author missing')
    }
  }
  const handleRemove = async (blog) => {
    try {
      await blogService.deleteBlog(blog)
      setMessage(`${blog.title} by ${blog.author} removed successfully!`)
      setBlogs(blogs.filter(filteredBlog => filteredBlog.id !== blog.id))
    } catch (error) {
      setMessage('Could not delete the blog!')
      setError(true)
      console.log(error)
    }
  }
  return (
    <div>
      <Message text={message} error={error}/>
      {!user && <LoginForm handleLogin={handleLogin}/>}

      {user &&
      <div>
        <p>Logged in as {user.name}</p>
        <button onClick={handleLogout} id='logout'>Logout</button>
      </div>}

      {user && <Togglable buttonLabel='New blog'>
        <BlogForm createBlog={createBlog}/>
      </Togglable>}

      {user && blogs.map(blog =>
        <Blog key={blog.id.toString()} blog={blog} handleLike={handleLike} handleRemove={handleRemove} user={user}/>
      )}
    </div>
  )
}

export default App
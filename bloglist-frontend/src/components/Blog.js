import { useState } from 'react'
import propTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [visible, setVisibility] = useState(false)
  Blog.propTypes = {
    blog: propTypes.object.isRequired,
    handleLike: propTypes.func.isRequired,
    handleRemove: propTypes.func.isRequired,
    user: propTypes.object.isRequired
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      handleRemove(blog)
    }
  }

  const addLike = () => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    handleLike(newBlog)
  }

  const handleClick = () => {
    setVisibility(!visible)
  }
  console.log('Blog: ', blog)
  const remove = user.username === blog.user.username ? '' : 'none'
  const text = visible ? 'Hide' : 'View'
  const show = visible ? '' : 'none'

  return (
    <div style={blogStyle} className='blog'>
      <div>
        <p>{blog.title} {blog.author}<button onClick={handleClick}>{text}</button></p>
      </div>
      <div style={{ display: show }} className='togglable'>
        <p>{blog.url}</p>
        <p>{blog.likes} <button className='like' onClick={addLike}>Like</button></p>
        <p>{blog.user.name}</p>
        <button style={{ display: remove }} onClick={removeBlog}>Remove</button>
      </div>
    </div>
  )
}
export default Blog
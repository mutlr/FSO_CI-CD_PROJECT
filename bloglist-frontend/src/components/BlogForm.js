import { useState } from 'react'
import propTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  BlogForm.propTypes = {
    createBlog: propTypes.func.isRequired
  }
  const addBlog = (e) => {
    e.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
              Title:
          <input type='text' value={title} onChange={ ({ target }) => (setTitle(target.value))} id='title' />
        </div>
        <div>
              Author:
          <input type='text' value={author} onChange={ ({ target }) => (setAuthor(target.value))} id='author' />
        </div>
        <div>
            URL:
          <input type='text' value={url} onChange={ ({ target }) => (setUrl(target.value))} id='url' />
        </div>
        <button type='submit' id='create'>Create</button>
      </form>
    </div>
  )
}
export default BlogForm
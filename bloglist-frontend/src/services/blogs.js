import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'

let token

const setToken = user => {
  token = `Bearer ${user.token}`
}
const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const createBlog = async (blog) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const response = await axios.post(baseUrl, blog, config)
  return response
}

const updateLike = async (blog) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog)
  return response.data
}

const deleteBlog = async (blog) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

export default { getAll, setToken, createBlog, updateLike, deleteBlog }
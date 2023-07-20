import axios from 'axios'
const URL = '/api/login'

const login = async (user) => {
  const response = await axios.post(URL, user)
  return response.data
}

export default { login }
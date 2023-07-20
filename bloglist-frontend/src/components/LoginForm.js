import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (e) => {
    e.preventDefault()
    handleLogin(username, password)
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={login}>
        <div>
          Username:
          <input type='text' value={username} onChange={ ({ target }) => setUsername(target.value)} id='username'/>
        </div>

        <div>
          Password:
          <input type='password' value={password} onChange={ ({ target }) => setPassword(target.value) } id='password' />
        </div>
        <button type='submit' id='loginButton'>Login</button>
      </form>
    </div>
  )
}
export default LoginForm
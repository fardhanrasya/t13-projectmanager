import './Login.css'
import { useState } from 'react'
import { useLogin } from '../../hooks/UseLogin'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const { login, isPending, error } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      <label >
        <span>Email: </span>
        <input type="email" onChange={e => setemail(e.target.value)} value={email} required />
      </label>
      <label >
        <span>Password: </span>
        <input type="password" onChange={e => setpassword(e.target.value)} value={password} required />
      </label>
      <span>Don't have an account yet? </span> <Link to='/Signup'>Signup</Link> <br></br>
      {!isPending && <button className="btn">Login</button>}
      {isPending && <button disabled className="btn">Loading</button>}
      {error && <div className='error'>{error}</div>}
    </form>
  )
}

import './Navbar.css'
import logo from '../assets/ts.svg'
import { Link } from 'react-router-dom/'
import { useLogout } from '../hooks/UseLogout'
import { useAuthContext } from '../hooks/UseAuthContext'

export default function Navbar() {
  const { logout, error, isPending } = useLogout()
  const { user } = useAuthContext()
  
  return (
    <div className='navbar'>
      <ul>
        <li className="logo">
          <img src={logo} alt="telkom-logo" />
          <span>T13 ProjectManager</span>
        </li>
        {!user && (
          <>
            <li>
              <Link to="/Login">Login</Link>
            </li>
            <li>
              <Link to="/Signup">Signup</Link>
            </li>
          </>
        )}
        {user && (
          <li>
            {!isPending && <button className="btn" onClick={logout}>Logout</button>}
            {isPending && <button className="btn" onClick={logout}>Logging out...</button>}
            {error && <div className='error'>{error}</div>}
          </li>
        )}
      </ul>
    </div>
  )
}

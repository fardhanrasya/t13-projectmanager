import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import DashboardIcon from '../assets/dashboard_icon.svg'
import AddIcon from '../assets/add_icon.svg'
import { useAuthContext } from '../hooks/UseAuthContext'
import Avatar from './Avatar'

export default function Sidebar() {
  const { user } = useAuthContext()

  return (
    <div className='sidebar'>
      <div className="sidebar-content">
        <div className="user">
          <Avatar src={user.photoURL}/>
          <p>Hello {user.displayName}</p>
        </div>
        <nav className="links">
          <ul>
            <li>
              <NavLink exact to="/">
                <img src={DashboardIcon} alt="DashboardIcon" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/Create">
                <img src={AddIcon} alt="AddIcon" />
                <span>New Project</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

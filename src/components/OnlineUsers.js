import './OnlineUsers.css'
import { useCollection } from '../hooks/UseCollection'
import Avatar from './Avatar'

export default function OnlineUsers() {
  const { isPending, error, documents } = useCollection('users')

  return (
    <div className='user-list'>
      <h2>All Users</h2>
      {isPending && <div>Loading users...</div>}
      {error && <div>{error}</div>}
      {documents && documents.map((user) => (
        <div key={user.id} className='user-list-item'>
          {user.online && <span className='online-user'></span>}
          <span>{user.displayName}</span>
          <Avatar src={user.photoURL}/>
        </div>
      ))}
    </div>
  )
}

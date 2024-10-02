import './Signup.css'
import { useSignup } from '../../hooks/UseSignUp'
import { useState } from 'react'

export default function Signup() {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [displayname, setdisplayname] = useState('')
  const [thumbnail, setthumbnail] = useState(null)
  const [thumbnailerror, setthumbnailerror] = useState(null)
  const { signup, error, isPending } = useSignup()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (thumbnailerror) {
      setthumbnail(null)
      return 
    }
    if (!thumbnail) {
      alert("please input the profile picture!")
      return 
    }

    signup(email, password, displayname, thumbnail);
  }

  const handleFileChange = (e) => {
    setthumbnail(null)
    let selected = e.target.files[0]

    if (!selected) {
      setthumbnailerror('Please select a file')
      return
    }
    if (!selected.type.includes('image')) {
      setthumbnailerror('Selected file must be an image')
      return
    }
    if (selected.size > 100000) {
      setthumbnailerror('Image file size must be less than 100kb')
      return
    }
    
    setthumbnailerror(null)
    setthumbnail(selected)
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
      <label >
        <span>Username: </span>
        <input type="text" onChange={e => setdisplayname(e.target.value)} value={displayname} required />
      </label>
      <label >
        <span>Profile picture (max: 100kb): </span>
        <input type="file" required onChange={handleFileChange}/>
        {thumbnailerror && <div className='error'>{thumbnailerror}</div>}
      </label>
      {!isPending && <button className="btn">Sign up</button>}
      {isPending && <button disabled className="btn">Loading</button>}
      {error && <div className='error'>{error}</div>}
    </form>
  )
}

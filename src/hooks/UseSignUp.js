import { useState, useEffect } from 'react'
import { auth, storage, db } from '../firebase/config'
import { useAuthContext } from './UseAuthContext'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null)
    setIsPending(true)
  
    try {
      // signup
      const res = await createUserWithEmailAndPassword(auth, email, password)

      if (!res) {
        throw new Error('Could not complete signup')
      }

      // upload user profile pic
      const uploadPath = `profile_pic/${res.user.uid}/${thumbnail.name}`
      const storageRef = ref(storage, uploadPath)
      const img = await uploadBytes(storageRef, thumbnail)
      const imgURL = await getDownloadURL(img.ref)

      // add display name to user
      await updateProfile(res.user, { displayName, photoURL: imgURL })

      // create user document
      const docRef = doc(db, `users/${res.user.uid}`)
      await setDoc(docRef, {
        online: true,
        displayName,
        photoURL: imgURL
      })

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { signup, error, isPending }
}
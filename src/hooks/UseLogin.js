import { useState, useEffect } from 'react'
import { auth, db } from '../firebase/config'
import { useAuthContext } from './UseAuthContext'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setError(null)
    setIsPending(true)
  
    try {
      // login
      const res = await signInWithEmailAndPassword(auth, email, password)

      // update online status
      const {uid} = auth.currentUser
      const docref = doc(db, `users/${uid}`)
      await updateDoc(docref, {
        online: true
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

  return { login, isPending, error }
}
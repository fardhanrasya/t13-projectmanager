import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

export default function UseDocument(_collection, id) {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const refDoc = doc(db, _collection, id)

    const unsub = onSnapshot(refDoc, snapshot => {
      if (snapshot.data()) {
        setDocument({...snapshot.data(), id: snapshot.id})
        setError(null)
      }
      else {
        setError('No such document exists')
      }
    }, err => {
      console.log(err.message);
      setError('failed to get document')
    })

    return () => unsub()
  }, [_collection, id])

  return { document, error }
}

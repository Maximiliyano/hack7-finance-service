import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: 'AIzaSyCTKY9JwhBHSn7bRgGYZSzvhaBT3bhMPzg',
  authDomain: 'ricecode-budget.firebaseapp.com',
  projectId: 'ricecode-budget',
  storageBucket: 'ricecode-budget.appspot.com',
  messagingSenderId: '424403354335',
  appId: '1:424403354335:web:b8fc9c3984ee9a9480df6a'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const getUser = async (email) => {
  const userSnapshot = await getDoc(doc(db, 'users', email))
  if (userSnapshot.exists()) {
    console.log('success')
    return userSnapshot.data()
  } else {
    const user = { email: email, credits: [], deposits: [], operations: [], total: 0 }
    console.log(user)
    await setDoc(doc(db, 'users', email), user)
    return user
  }
}

const updateUser = async (user) => {
  const userRef = doc(db, 'users', user.email)
  await setDoc(userRef, {
    email: user.email,
    credits: user.credits,
    deposits: user.deposits,
    operations: user.operations,
    total: user.total
  })
}

export { getUser, updateUser }

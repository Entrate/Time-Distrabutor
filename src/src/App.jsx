
import {  useEffect, useState } from 'react'
import './App.css'
import MainButtonContainer from './components/MainButtonContainer'
import TodaysUse from './components/TodaysUse'
import SignInWithGoogle from './components/signInWithGoogle'
import { auth, db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import GraphContainer from './components/GraphContainer'



function App() {
  const [timeToday, setTimeToday] = useState({productive: 0,leasure: 0})
  const [authStatus, setAuthStatus] = useState(auth._isInitialized)
  const [buttonState,setButtonState] = useState({0:false,1:false})

  let i = 0
  const getDatabaseData = async () => {
    const currentUserRef = doc(db, 'users', auth.currentUser.uid)
    const docSnap = await getDoc(currentUserRef);
    if (docSnap.exists()) {
      // if its a different day this will return Invalid Date sooo Fix????
      const dateInDataBase = new Date(docSnap.data().lastLogin).toString().slice(4,15)
      const dateNow = Date(Date.now()).toString().slice(4,15)
      // bro what DID YOU DO THIS IS DOG SHIT PLEASE FIX
      // Dont ignore me and fix this shit
      if(dateInDataBase != dateNow && dateInDataBase != 'lid Date') {
        setDoc(doc(db, 'users', `${auth.currentUser.uid}/dates/${dateNow.split(' ').join('-')}`), {
          timer: timeToday,
          date: Date.now()
        }, { merge: true  })
        setDoc(currentUserRef, {
          timer: {productive: 0,leasure: 0},
          lastLogin: Date.now()
        }, {  merge:true  })
        setTimeToday({productive: 0,leasure: 0})
      } else {
        if(docSnap.data().timer !== undefined){
          setTimeToday(docSnap.data().timer)
        } else {
          i += 1
          if(i >= 5){
            return
          }
          getDatabaseData()
        }
      }

    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }
  useEffect(() => {
      if(authStatus) {
        getDatabaseData()
      }
  }, [authStatus])

  const updateTime = async (time,type) => {
      setTimeToday({...timeToday, [type]: time})
  }
  const updateAuthStatus = () => {
    setAuthStatus(auth._isInitialized)
  }

  return (
    <>
    { authStatus ? 
    <div className='site-container'>
    <h1 className='title'>WELCOME TO<br/>TIME DISTRABUTOR</h1>
    <GraphContainer
    buttonState={buttonState}
    />
    <MainButtonContainer 
      updateTimeToday={(e) => setTimeToday(e)}
      update={updateTime}
      time={timeToday}
      buttonState={buttonState}
      setButtonState={setButtonState} 
    />
    <TodaysUse
      timer={timeToday}
    />
    <footer className='footer'>Design and all code made by amin.aliu.fi@gmail.com</footer>
    </div>
    :
    <SignInWithGoogle 
      updateStatus={updateAuthStatus}
      timer={timeToday}
    />
    }
    </>
  )
}

export default App

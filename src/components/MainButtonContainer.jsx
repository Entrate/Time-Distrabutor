
import { useEffect, useState } from "react"
import MainButton from "./MainButton"
import { auth, db } from "../firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

function MainButtonContainer({update, time, updateTimeToday}) {
  const [buttonState,setButtonState] = useState({0:false,1:false})
  const [activeButton, setActiveButton] = useState(null)

  useEffect(() => {
    setActiveButton(buttonState[0] ? 0 : buttonState[1] ? 1 : null);
  }, [buttonState]);


  const clickHadler = (i) => {
    let oppositeNum = i == 0 ? 1 : 0
    if(buttonState[oppositeNum]) {
      setButtonState(prev => {
        return {...prev, [oppositeNum]: false}
      })
    }
    setButtonState((prev) => {
      return {...prev, [i]: !prev[i]}
    }) 
    updateDatabase()
  }

  const updateDatabase = async () => {

    const dateNow  = Date(Date.now()).toString().slice(4,15)
    const dateMMDDYYYY = dateNow.split(' ').join('-')
    const dateTodayRef = doc(db, 'users', `${auth.currentUser.uid}/dates/${dateMMDDYYYY}`)
    const currUserRef = doc(db, 'users', `${auth.currentUser.uid}`)
    const docSnap = await getDoc(currUserRef)
    const storedDate = new Date(docSnap.data().lastLogin).toString().slice(4,15)
    if(storedDate != dateNow){
      updateTimeToday({productive: 0,leasure: 0})
      setDoc(doc(db, 'users', auth.currentUser.uid), {
        lastLogin: Date.now(),
        timer: {productive: 0,leasure: 0}
      }, { merge: true})
    } else {

      setDoc(doc(db, 'users', auth.currentUser.uid), {
        lastLogin: Date.now(),
        timer: time
      }, { merge: true})

      setDoc(dateTodayRef, {
        timer: time,
      }, { merge: true})
    }
  }


  return (
    <div className='main-button-container'>
      <MainButton 
      innerText="Start leasure"
      color="rgba(248, 182, 85, 1)"
      clickHadler={() => clickHadler(0)}
      buttonState={buttonState["0"]}  
      update={(timer) => update(timer,'leasure')}
      time={time.leasure}
      type='leasure'
      activeButton={activeButton}
      fullTimer={time}
      />
      <MainButton 
      innerText="Start productive"
      color="rgba(160, 158, 254, 1)"
      clickHadler={() => clickHadler(1)}
      buttonState={buttonState["1"]}
      update={(timer) => update(timer,'productive')}
      time={time.productive}
      type='productive'
      activeButton={activeButton}
      fullTimer={time}
      />
    </div>
  )
}
export default MainButtonContainer
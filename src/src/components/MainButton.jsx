import { doc, getDoc, setDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db } from "../firebase"

const MainButton = ({innerText,color, clickHadler,buttonState, update,time,type, activeButton, fullTimer}) => {
  const styles = {
    backgroundColor: buttonState ? 'rgba(241, 107, 31, 1)' : color
  }
  const wordArr = innerText.split(' ').map((word, i) => <p key={i} className="button-text">{word}</p>)
  const endWordArr = innerText.split(' ').map((word, i) => {
  if(word == 'Start'){
    return <p key={i} className="button-text">End</p>
  } else {
    return <p key={i} className="button-text">{word}</p>
  }
})
  const [timer, setTimer] = useState(time)
  const [timeOgj, setTimeobj] = useState({h: 0,m: 0,s: 0})
  const [displayTimer, setDisplayTimer] = useState(0)

  useEffect(() => {
  const visibility = document.visibilityState
  const currentUserRef = doc(db, 'users', auth.currentUser.uid)
  const keyForDb = type + 'CurrentDisplayTime'
  const updateDomWithTrueValues = async () => {
      const res = await getDoc(currentUserRef)
      const data = res.data()
      const timeSenceTabWasLive = Math.floor((Date.now() - data.lastLogin) / 1000)
      const timerBeforeTabHiding = data.timer[type]
      const displayTimerBeforeTabHiding = data[keyForDb]
      setTimer(timerBeforeTabHiding + timeSenceTabWasLive)
      setDisplayTimer(displayTimerBeforeTabHiding + timeSenceTabWasLive)
      // console.log(timeSenceTabWasLive)
      // console.log('Display Time Should be:',displayTimerBeforeTabHiding + timeSenceTabWasLive)
    }
    if(activeButton !== null){
      if(type === 'leasure' && activeButton === 0 || type === 'productive' && activeButton === 1){
        if(visibility === 'hidden'){
          setDoc(currentUserRef, {
            lastLogin: Date.now(),
            timer: {...fullTimer},
            [keyForDb]: displayTimer
          }, { merge: true })
        } else {
          updateDomWithTrueValues()
        }
      }
    }
  }, [document.visibilityState]);

  useEffect(() => {
    if(!buttonState) return 
    let hours = Math.floor(displayTimer / (60 * 60))
    let divisor_for_minutes = displayTimer % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.floor(divisor_for_seconds);
    setTimeobj({h:hours,m:minutes,s:seconds})
    update(timer)
  },[timer])

  useEffect(() => {
    if(time !== timer) {
      setTimer(time)
    }
  },[time])

  useEffect(() => {
    if(!buttonState) {

      const arrOfTimeFromDayChange = Date(Date.now()).toString().slice(16,24).split(':')
      const howLongItsBeenSence12 = Number(arrOfTimeFromDayChange[0] * (60 * 60) + arrOfTimeFromDayChange[1] * 60 + Number(arrOfTimeFromDayChange[2]))
      if(displayTimer > 86400000) {
        setDisplayTimer(0)
        setTimer(0)
      }
      
      if(displayTimer > howLongItsBeenSence12) {
        const updateToDb = async() => {
          const daybeforeToday = new Date(Date.now() - 86400000).toString().slice(4,15).split(' ').join('-')
          const beforeTodayRef = doc(db, 'users', `${auth.currentUser.uid}/dates/${daybeforeToday}`)
          const result = await getDoc(beforeTodayRef)
          const pastValueOfType = result.data().timer[type]

          setDoc(beforeTodayRef, {
            timer: {
              [type]: pastValueOfType + (displayTimer - howLongItsBeenSence12)
            }
          }, { merge: true })
        }
        updateToDb()
        setTimer(howLongItsBeenSence12)
      }
      setDisplayTimer(0)
    } else {
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer += 1)
      setDisplayTimer(prevTimer => prevTimer += 1)
    },1000)

    return () => clearInterval(interval)
    }
  },[buttonState])

    const timerLogic = <>{timeOgj.h}:{timeOgj.m < 10 && '0'}{timeOgj.m}:{timeOgj.s < 10 && '0'}{displayTimer > 0 && timeOgj.s}{displayTimer == 0 && '0'}</>
  
    return (
    <div className="btn-and-timer">
      <button className="main-button" style={styles} onClick={clickHadler}>{buttonState ? endWordArr : wordArr}</button>

      {buttonState && <div className="timer">{timerLogic}</div>}
    </div>
  )
}

export default MainButton
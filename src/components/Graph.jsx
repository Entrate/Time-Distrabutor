import { useEffect, useState } from "react"
import GraphBar from "./GraphBar"
import { query, getDocs, collection, where, limit} from "firebase/firestore"
import { auth, db } from "../firebase"


const Graph = ({buttonState}) => {
  const [pastWeek, setPastWeek] = useState([])
  const [totalHeight, setTotalHeight] = useState([])
  const [daysOfTheWeek, setDaysOfTheWeek] = useState(['mon','tue','wed','thu', 'fri', 'sat', 'sun'])
  const [largestSum, setLargestSum] = useState(0)
  const getDataForPastWeek = async() => {
    let tempWeekDaysArr = []
    for(let i = 0; i < 7;i++){
      tempWeekDaysArr.push(new Date(Date.now() - 86400000 * i).toString().slice(0,3))
    }
    setDaysOfTheWeek(tempWeekDaysArr.reverse())
    const q = query(collection(db, 'users', `${auth.currentUser.uid}/dates`), where("date", ">=", Date.now() - 86400000 * 7),limit(7))
    const updatedData = await getDocs(q)
    let combinedNumbersArr = []
    let biggestSum = 0
    let prevDate = "";
    updatedData.forEach((doc) => {
      const data = doc.data()
      const timer = data.timer
      const dateInDays = Math.floor(data.date / (1000 * 60 * 60 * 24))
      const dateFrom7DaysAgo = Math.floor((Date.now() - 86400000 * 6) / (1000 * 60 * 60 * 24))
      const howManyEmptyDays = dateInDays - dateFrom7DaysAgo 
        if(prevDate != "" && dateInDays - prevDate != 1){
          const amounOfDaysBetween = dateInDays - prevDate - 1
          for(let i = 1; i <= amounOfDaysBetween; i++){
          combinedNumbersArr.push(0)
          setPastWeek(prevPastWeek => [...prevPastWeek,{productive: 0,leasure: 0}] )
          }
        } else if(prevDate == ""){
          if(dateInDays == dateFrom7DaysAgo){

          }else {
            for(let i = 0; i < howManyEmptyDays; i++){
              combinedNumbersArr.unshift(0)
              setPastWeek(prevPastWeek => [{productive: 0,leasure: 0},...prevPastWeek] )
              }
          }
        }
      setPastWeek(prevPastWeek => [...prevPastWeek,timer] )
      if(timer.leasure + timer.productive >= biggestSum){
        biggestSum = doc.data().timer.leasure + doc.data().timer.productive
      }
      combinedNumbersArr.push(timer.leasure + timer.productive)
      prevDate = dateInDays
    })
    setTotalHeight(
      combinedNumbersArr.map((num) => {
      return Math.floor(num / biggestSum * 10000) / 100
    }))
    setLargestSum(biggestSum)
  }

  useEffect(() => {
      getDataForPastWeek()

    return setPastWeek([])
  },[buttonState])

  const daysArr = daysOfTheWeek.map((day,i) => <p key={i} className="days">{day}</p>)
  let aboveLine
  if(largestSum > 60 * 60){
    aboveLine = `${Math.floor(largestSum / (60 * 60) * 100)/ 100}H`
  } else {
    aboveLine = `${Math.floor(largestSum / 60)}min`
  }
  return (
    <div className="graph">
      <h1 className="title">Past 7 Days</h1>
      <div className="graph-bar-container">
        <div className="top-line">
          <hr/>
          <span className="inner-text">
            {aboveLine}
          </span>
        </div>

        <GraphBar
        timer={pastWeek[0]}
        totalHeight={totalHeight[0]}
        />
        <GraphBar
        timer={pastWeek[1]}
        totalHeight={totalHeight[1]}
        />
        <GraphBar
        timer={pastWeek[2]}
        totalHeight={totalHeight[2]}
        />
        <GraphBar
        timer={pastWeek[3]}
        totalHeight={totalHeight[3]}
        />
        <GraphBar
        timer={pastWeek[4]}
        totalHeight={totalHeight[4]}
        />
        <GraphBar
        timer={pastWeek[5]}
        totalHeight={totalHeight[5]}
        />
        <GraphBar
        timer={pastWeek[6]}
        totalHeight={totalHeight[6]}
        />
      </div>
      <div className="under-liner"></div>
      <div className="days-container">{daysArr}</div>
    </div>
  )
}

export default Graph
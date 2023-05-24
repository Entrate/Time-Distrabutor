const TodaysUse = ({timer}) => {

  const dispayedTimeRight = Math.floor((timer.productive * 10) / (60 * 60)) / 10
  const dispayedTimeLeft = Math.floor((timer.leasure * 10) / (60 * 60)) / 10
  const combinedTimer = timer.leasure + timer.productive
  let leftWidth = Math.round((timer.leasure / combinedTimer) * 100) + '%'
  let rightWidth = Math.round((timer.productive / combinedTimer) * 100) + '%'
  if(timer.leasure == 0 && timer.productive == 0){
    leftWidth = "100%"
    rightWidth = "100%"
  }
  const leftStyles = {
      width: leftWidth
  }
  const rightStyles = {
    width: rightWidth
  }
  return (
    <>
      <h2 className="sub-title">Today</h2>
      <div className="time-spent-bar">
        <div className="left-bar" style={leftStyles}>{dispayedTimeLeft}H</div>
        <div className="right-bar" style={rightStyles}>{dispayedTimeRight}H</div>
      </div>
    </>
  )
}
export default TodaysUse
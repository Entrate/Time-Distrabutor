import { useState } from "react"
import { Tooltip } from '@mui/material';


const GraphBar = ({timer, totalHeight}) => {
  let bottomStyles
  let topTooltip
  let bottomTooltip
  if(totalHeight > 100){
    totalHeight = 100
  }
  const mainStyle = {
    height: `${totalHeight}%`,
  }
  

  if(timer !== undefined){
    if(timer.productive > 60 * 60){
      topTooltip = `${Math.floor(timer.productive / (60 * 60) * 10) / 10}H` 
    } else {
      topTooltip = `${Math.floor(timer.productive / (60) * 10) / 10}min` 
    }
    if(timer.leasure > 3600){
      bottomTooltip = `${Math.floor(timer.leasure / (60 * 60) * 10) / 10}H` 
    } else {
      bottomTooltip = `${Math.floor(timer.leasure / (60) * 10) / 10}min` 
    }
    bottomStyles = {
    top: `${Math.round(timer.productive / (timer.productive + timer.leasure) * 100)}%`
    }
  }
  


  return (
    <div className="bar-container" style={mainStyle}>

    <Tooltip title={topTooltip} arrow followCursor placement="right">
    <div id="top-part" className="top-part"></div>
    </Tooltip>

    <Tooltip title={bottomTooltip} arrow followCursor placement="right">
    <div id="bottom-part" className="bottom-part" style={bottomStyles}></div>
    </Tooltip>

    </div>
  )
}

export default GraphBar
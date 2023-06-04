import Graph from "./Graph"


const GraphContainer = ({buttonState}) => {
  return (
    <div className="graph-and-button"> 
    <Graph
    buttonState={buttonState}
    />
    </div>
  )
}

export default GraphContainer
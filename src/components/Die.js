import React from 'react'

const Die = (props) => {
  const diedots = [...Array(props.value)].map( (el, index) => {
    return <span key = {index} className= "dieDot"></span>
  })

  const styles = {
    backgroundColor : props.isHeld ? "#59E391" : "white",
  }
  return (
    <div className='die-wrapper' style = {styles} onClick = {props.holdDice}>
       {diedots}
    </div>
  )
}

export default Die;
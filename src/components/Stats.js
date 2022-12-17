import React from 'react'

const Stats = ({attempts, seconds, bestTime}) => {

  function time (unit){
    const minutes = Math.floor(unit / 60);
    const seconds = unit - minutes * 60;
    const timepass = 
      seconds < 10 ? `0${minutes} : 0${seconds}` : `0${minutes} : ${seconds}`;
    return timepass;
  }
  return (
    <>
      <div>⏱ {time(seconds)}</div>
      <div className="best-time">🏆 Best Time {time(bestTime)}</div>
      <h3 className='attempts'>Attempts : {attempts}</h3>
    </>
  )
}

export default Stats;
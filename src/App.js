import React, {useState, useEffect} from 'react';
import './App.css';
import Die from './components/Die';
import Stats from './components/Stats';
import Confetti from 'react-confetti';
import { nanoid } from 'nanoid';

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [stats, setStats] = useState(generateStats());
  const [bestTime, setBestTime] = useState(
    () => localStorage.getItem("bestTime") ? JSON.parse(localStorage.getItem("bestTime")) : null
  )

  function allNewDice (){
    let newDiceArray = [];

    for(let i = 0; i < 10; i++){
      newDiceArray.push(generateDice());
    }

    return newDiceArray;
  }

  function generateDice (){
    return{
      value : Math.ceil(Math.random() * 6),
      isHeld : false,
      id : nanoid()
    }
  }

  function generateStats () {
    return {
      seconds : 0,
      attempts : 0,
      id : nanoid()
    }
  }

  // hold dice color when clciked
  function holdDice (id) {
    setDice(oldDices => oldDices.map(dices => {
      // hold the die if the id of the die in our array is the same with user click
      return dices.id === id ? {...dices, isHeld : !dices.isHeld} : dices;
    }))
  }

  function rollDice () {
    if(!tenzies){
      setDice(oldDices => oldDices.map(dies => {
        //check if all dices are held
        return dies.isHeld ? dies : generateDice();
      }))
      setStats(prevStats => ({...prevStats, attempts : prevStats.attempts++}))
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setStats(generateStats());
    }
  }

  //2 states in sync require useeffect hook
  useEffect(() => {
    const allHeldDice = dice.every(die => die.isHeld === true);
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);
    
     // check if all the dice are held and have the same value
    if(allHeldDice && allSameValue){
      setTenzies(true);

      // check there is a best time or if there isn't a local storage yet
      if(
        stats.seconds < localStorage.getItem("bestTime") ||
        !localStorage.getItem("bestTime")
      ) {

        //save the new best time state and create / update local storage
        setBestTime(stats.seconds);
        localStorage.setItem("bestTime", JSON.stringify(stats.seconds));
      }
    }
  }, [dice, stats.seconds, bestTime])





  // timer requires useEffect
  useEffect(() => {
    let timeInterval;
    if(!tenzies){
      timeInterval = setInterval(() => {
        setStats(prevStats => ({...prevStats, seconds : (prevStats.seconds++)}))
      }, 1000)
    } else if(stats.seconds !== 0 && tenzies){
      clearInterval(timeInterval);
    }

    // timer requires clean up
    return () => clearInterval(timeInterval)
  }, [stats.seconds, tenzies])


  const diceElements = dice.map(die => (
      <Die
        key = {die.id}
        value = {die.value}
        isHeld = {die.isHeld}
        holdDice = {() => holdDice(die.id)}
      />
  ))
  return (
    <div className='container'>
      {tenzies && <Confetti/>}
      <h1 className='main-title'>Tenzies</h1>
      <h4 className='subtitle'>Roll until all dice are the same.Click each die to freeze it at its current value between rolls.</h4>

      {/* put dice elements */}
      <div className='die-container'>
        {diceElements}
      </div>
      <button className='btn roll-btn' onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
      <Stats
        id = {stats.id}
        attempts = {stats.attempts}
        seconds = {stats.seconds}
        bestTime = {bestTime}
      />
    </div>
  );
}

export default App;

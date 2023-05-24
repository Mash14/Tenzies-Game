import React, {useState,useEffect} from 'react';
import Die from './die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import EasyTimer from 'easytimer.js';
import Loader from './loader';

function Main() {

    const [arr, updateArr] = React.useState( allNewDice())
    const [tenzies,youWon] = useState(false)
    const [rolls, upDateRolls] = useState(0)
    const [time,updateTime] = useState({
        timer_text:'00:00:00',timer:new EasyTimer()
    })
    // the time taken for the game
    const [elapsedTime, setElapsedTime] = useState(0)
    // previous record 
    const [previousRecord, setPreviousRecord] = useState(
        parseFloat(localStorage.time) || null 
    );
    const [isLoading, setLoading] = useState(false)

    // Store rolls to localStorage
    useEffect(()=> {
        if(tenzies) {
            // First set up localStorage
            if(!localStorage.rolls) {
                localStorage.setItem('rolls',rolls)
            }
            // Update localStorage
            if (rolls < localStorage.rolls){
                localStorage.setItem('rolls',rolls)
            }
        }
        
    },[tenzies])

    // Time taken to win
    useEffect(()=>{
        let timer = time.timer
        time.timer.start()
        timer.addEventListener('secondsUpdated',onTimerUpdated)
        if(tenzies) {
            time.timer.stop() 
        }
    })
    // update the elapsed time every second
    useEffect(()=> {
        if(time.timer && !tenzies) {
            const interval = setInterval(()=> {
                const wakati = time.timer.getTimeValues().seconds;
                setElapsedTime(wakati); 
            },1000)
            
            // Cleanup the interval when the component unmounts
            return () => clearInterval(interval)
        }
    },[time.timer,tenzies])
    // Set up to the localStorage 
    useEffect(()=> {
        if(tenzies) {
            if(!previousRecord || elapsedTime < previousRecord) {
                localStorage.time = elapsedTime.toString();
                setPreviousRecord(elapsedTime);
            }
        }
    },[elapsedTime,previousRecord,tenzies])

    function onTimerUpdated(e) {
        updateTime(prev => ({
            ...prev,
            timer_text : time.timer.getTimeValues().toString()
        }))
    }

    // Formart the elapsed time
    const formartTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2,'0')}:
                ${minutes.toString().padStart(2,'0')}:
                ${seconds.toString().padStart(2,'0')}`
    };

    // Check wining game
    useEffect(()=> {
        // every() it is used to check that all values of an array are the same and returns false if not otherwise true
        // to check if won we see if all the dice have been held and they have the same value -> die.isHeld === true
        const allAreHeld = arr.every(die => die.isHeld)
        const allSameValue = arr.every(die => arr[0].value === die.value)
        if (allAreHeld && allSameValue) {
            youWon(true)
        }
    },[arr])

    // New Dice
    function allNewDice() {
        let array = []
        for (let i = 0; i < 10; i++ ) {
            let randomNumber = Math.ceil(Math.random()*6)
            array.push({
                'value':randomNumber,
                isHeld:false,
                id: nanoid()
            })
        }
        return array
        
    }  

    function generateNewValue() {
        return {
            'value':Math.ceil(Math.random()*6),
            isHeld:false,
            id: nanoid()
        }
    }

    // Hold specific die
    function hold(id) {
        if (!tenzies) {
            updateArr(prev => (
                prev.map(die => {
                    return (id === die.id) ? {...die, isHeld : !die.isHeld} : die 
                })
            ))
        } 
    }

    function rollDice() {
        // if not won the game it rolls otherwise starts a new game
        if (!tenzies) {
            updateArr(prev => (
                prev.map(die => {
                    return die.isHeld ? die : generateNewValue()
                }))
            )
            upDateRolls(prev => prev + 1)
        } else {
            setLoading(true)
            setTimeout(()=> {
                updateArr(allNewDice())
                youWon(false)
                upDateRolls(0)
                setLoading(false)
            },2000)
            
        }
    }

    // Each die   
    const diceElements = arr.map(die => <Die 
        key={die.id} 
        die={die} 
        hold={hold}
        rollDie={rollDice}
        />)

    return ( 
        <React.Fragment>
            
            <div className="border">
                {isLoading ? 
                    <Loader/>
                    :
                    <div className="all">
                        {tenzies && <Confetti width={960} height={600}/>}
                        <div className="inner-border">
                            {/* <p>{time.timer_text}</p> */}
                            <div className="game">
                                <div className='title'>
                                    <h2>Tenzies Game</h2>
                                </div>
                                <div className="text">
                                    <p>Roll untill all dice are the same. Click Each die to freeze it at its current value between rolls</p>
                                </div>
                                <div className="items">
                                    {diceElements}
                                </div>
                                
                                <button className='roll' onClick={rollDice }>{tenzies ? 'New Game' : 'Roll'}</button>
                                
                                <div className='flex'>
                                    {tenzies ? <div className='pad'>Winning rolls : {rolls}</div> : <div className='pad'>Rolls : {rolls}</div>}
                                    {localStorage.rolls && localStorage.rolls ? <div>Record rolls : {localStorage.rolls}</div> : <div></div>}
                                </div>
                                <div className="time">
                                    <div className="time-text pad">Time : {time.timer_text}</div>
                                    {localStorage.time && <div className="time-text pad">Record Time : {formartTime(previousRecord)}</div>}
                                </div>
                                
                            </div>
                        </div>
                    </div>
                }
            </div>
        </React.Fragment>
    );
}

export default Main;
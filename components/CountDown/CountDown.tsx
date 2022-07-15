import { useState, useEffect } from 'react'

interface Props {
  hours: string;
  minutes: string;
  seconds: string;
  start: boolean;
  convert: boolean;
  player: string;
  curPlayer: string;
  handleSetWinPlayer: any;
  handleSetStart: any;
  handleSetConvert: any;
}

function CountDown({ hours = '0', minutes = '0', seconds = '0', start, convert, player, curPlayer, handleSetWinPlayer, handleSetStart, handleSetConvert }: Props) {
  const [paused, setPaused ] = useState(true);
  const [over, setOver] = useState(false);

  const [time, setTime] = useState({
    hours: parseInt(hours),
    minutes: parseInt(minutes),
    seconds: parseInt(seconds),
  })

  const tick = () => {
    if (paused || over) return;
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      setOver(true);
    } else if (time.minutes === 0 && time.seconds === 0) {
      setTime({
        ...time,
        hours: time.hours - 1,
        minutes: 59,
        seconds: 59,
      })
    } else if (time.seconds === 0) {
      setTime({
        ...time,
        hours: time.hours,
        minutes: time.minutes - 1,
        seconds: 59,
      })
    } else {
      setTime({
        ...time,
        hours: time.hours,
        minutes: time.minutes,
        seconds: time.seconds - 1,
      })
    }
  }

  const reset = () => {
    setTime({
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: parseInt(seconds),
    });
    setPaused(true);
    setOver(false);
  }

  useEffect(() => {
    let timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  })

  useEffect(() => {
    if (start) {
      setPaused(false)
      handleSetStart(false)
    }
    if (!start && convert) {
      setTime({
        hours: parseInt(hours),
        minutes: parseInt(minutes),
        seconds: parseInt(seconds),       
      })
      setPaused(!paused)
      handleSetConvert(false)
    }
    if (curPlayer && over) {
      handleSetWinPlayer(curPlayer === 'red' ? 'black' : 'red')
    }
  }, [start, convert, over])

  return (
    <div>
      <p>
        {
          `${time.hours
          .toString()
          .padStart(2, "0")}:${time.minutes
          .toString()
          .padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`
        }
      </p>
    </div>
  )
}

export default CountDown

import React, {FC, useEffect, useRef, useState} from 'react';
import {Socket} from "socket.io-client";

interface TimerProps {
    active : boolean,
    socket : Socket | null,
    sessionId : string
}

const Timer: FC<TimerProps> = ({active, socket, sessionId}) => {

    const TIME_LIMIT = '20'

    const Ref = useRef<number>(null);
    const timerCircle = useRef<SVGPathElement>(null)

    const [timer, setTimer] = useState('0');


    useEffect(() => {

        console.log('fgfdhd', active)

        if (active)
            restartTimer(getDeadTime() + TIME_LIMIT)
        else {
            console.log('timer stop')
            stopTimer()
        }

        return () => stopTimer()

    }, [active])

    const getTimeRemaining = (e :string) => {
        const total = Date.parse(e) - Date.parse(String(new Date()));
        const seconds = Math.floor((total / 1000) % 60);
        return {
            total, seconds
        };
    }

    const startTimer = (e : string) => {
        let {total, seconds}
            = getTimeRemaining(e);

        const circleDasharray = `${(
            calculateTimeFraction(seconds) * 283
        ).toFixed(0)} 283`;

        if (timerCircle.current && total > 0) timerCircle.current.setAttribute("stroke-dasharray", circleDasharray)
        else if (timerCircle.current) timerCircle.current.style.display = 'none'

        if (total >= 0) {
            setTimer(String(seconds))
            console.log(seconds)
            socket?.emit('timerUpdate', seconds, sessionId)
        }
        else {
            if (Ref.current) clearInterval(Ref.current);
        }
    }

    function calculateTimeFraction(total : number) {
        const rawTimeFraction = +total / +TIME_LIMIT;
        return rawTimeFraction - (1 / +TIME_LIMIT) * (1 - rawTimeFraction);
    }

    const restartTimer = (e : string) => {
        if (timerCircle.current) {
            timerCircle.current.setAttribute("stroke-dasharray", '283 283')
            timerCircle.current.style.display = 'block'
        }

        setTimer(TIME_LIMIT);

        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)

        // @ts-ignore
        Ref.current = id;
    }

    const stopTimer = () => {
        if (Ref.current) clearInterval(Ref.current)
    }

    const getDeadTime = () => {
        let deadline = new Date();

        deadline.setSeconds(deadline.getSeconds() + +TIME_LIMIT);
        return deadline;
    }


    return (
        <div className={`timer`}>
            <svg className="timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor='#EBC57A' />
                        <stop offset="100%" stopColor='#E29A0C'  />
                    </linearGradient>
                    <path
                        ref={timerCircle}
                        strokeDasharray="283"
                        className="timer__circle"
                        d="
                          M 50, 50
                          m -45, 0
                          a 45,45 0 1,0 90,0
                          a 45,45 0 1,0 -90,0
                        "
                    />
                </g>
            </svg>
            <span>{timer}</span>
        </div>
    )
};

export {Timer};
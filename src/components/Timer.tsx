import React, {FC, useEffect, useRef, useState} from 'react';
import {Socket} from "socket.io-client";
import {useTimer} from "react-timer-hook";

interface TimerProps {
    callback?: (value : number, action : string) => void,
    active : boolean,
    socket? : Socket | null
}

const Timer: FC<TimerProps> = ({socket,callback, active}) => {

    const TIME_LIMIT = 20;
    const FULL_DASH_ARRAY = 283;

    const circle = useRef<SVGPathElement>(null)

    const time = new Date();
    time.setSeconds(time.getSeconds() + TIME_LIMIT);
    const {seconds, pause, restart} = useTimer({
        expiryTimestamp: time,
        onExpire: () => callback ? callback(0,'pass') : undefined,
        autoStart: false
    })

    function startTimer(time : Date) {
        restart(time)
    }

    useEffect(() => {
        if (active) startTimer(time)
        else pause()
    }, [active])

    useEffect(() => {
        const circleDasharray = `${(seconds * FULL_DASH_ARRAY / TIME_LIMIT).toFixed(0)}`;
        circle.current?.setAttribute('stroke-dashoffset',circleDasharray)
    }, [seconds])

    return (
        <div className="timer">
            <svg className="timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g className="timer__circle">
                    <linearGradient id="grad1"  x1="0%" y1="50%" x2="100%" y2="50%" >

                        <stop offset="0%" stopColor='rgb(235,197,122)' stopOpacity='1.00' />
                        <stop offset="100%" stopColor='rgb(226,154,12)' stopOpacity='1.00' />

                    </linearGradient>
                    <path
                        ref={circle}
                        id="timer-path-remaining"
                        strokeDasharray={FULL_DASH_ARRAY}
                        strokeDashoffset={FULL_DASH_ARRAY}
                        className="timer__path-remaining"
                        d="
                          M 50, 50
                          m -45, 0
                          a 45,45 0 1,0 90,0
                          a 45,45 0 1,0 -90,0
                        "
                    />
                </g>
            </svg>
            <span>
                {seconds}
            </span>
        </div>
    );
};

export {Timer};
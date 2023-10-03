import React, {FC, useEffect, useRef, useState} from 'react';

interface PlayerTimer {
    value : number
}

const PlayerTimer: FC<PlayerTimer> = ({value}) => {

    const TIME_LIMIT = '20'

    const timerCircle = useRef<SVGPathElement>(null)

    const [timer, setTimer] = useState(TIME_LIMIT);


    useEffect(() => {

        const circleDasharray = `${(
            calculateTimeFraction(value) * 283
        ).toFixed(0)} 283`;

        if (timerCircle.current && value > 0) timerCircle.current.setAttribute("stroke-dasharray", circleDasharray)


        setTimer(String(value))

    }, [value])

    function calculateTimeFraction(total : number) {
        const rawTimeFraction = +total / +TIME_LIMIT;
        return rawTimeFraction - (1 / +TIME_LIMIT) * (1 - rawTimeFraction);
    }


    return (
        <div className={`timer timer__player`}>
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

export {PlayerTimer};
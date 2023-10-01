import React, {FC, useEffect, useRef, useState} from 'react';

interface TimerProps {
    active : boolean,
}

const Timer: FC<TimerProps> = ({active}) => {

    const startValue = '20'

    const Ref = useRef<number>(null);
    const timerCircle = useRef<SVGPathElement>(null)

    const [timer, setTimer] = useState('0');


    useEffect(() => {

        if (active)
            restartTimer(getDeadTime() + startValue)
        else
            stopTimer()

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
        }
        else {
            if (Ref.current) clearInterval(Ref.current);
            console.log('Время закончилось')
        }
    }

    function calculateTimeFraction(total : number) {
        const rawTimeFraction = +total / +startValue;
        return rawTimeFraction - (1 / +startValue) * (1 - rawTimeFraction);
    }

    const restartTimer = (e : string) => {
        if (timerCircle.current) {
            timerCircle.current.setAttribute("stroke-dasharray", '283 283')
            timerCircle.current.style.display = 'block'
        }

        setTimer(startValue);

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

        deadline.setSeconds(deadline.getSeconds() + +startValue);
        return deadline;
    }

    useEffect(() => {
        restartTimer(getDeadTime() + startValue)
    }, []);


    return (
        <div className="timer">
            <svg className="timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor='#EBC57A' />
                        <stop offset="100%" stopColor='#E29A0C'  />
                    </linearGradient>
                    <path
                        ref={timerCircle}
                        stroke-dasharray="283"
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
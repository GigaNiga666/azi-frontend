import React, {FC, useEffect, useRef, useState} from 'react';

interface TimerProps {
    restartTimerFun : Function,
    stopTimerFun : Function
}

const Timer: FC<TimerProps> = ({restartTimerFun, stopTimerFun}) => {

    const startValue = '20'

    const Ref = useRef<NodeJS.Timer>(null);

    const [timer, setTimer] = useState('0');

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
        if (total >= 0) {
            setTimer(String(seconds))
        }
        else {
            if (Ref.current) clearInterval(Ref.current);
            console.log('Время закончилось')
        }
    }

    const restartTimer = (e : string) => {

        setTimer(startValue);

        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)

        // @ts-ignore
        Ref.current = id;
    }

    const stopTimer = () => {
        if (Ref.current) clearInterval(Ref.current);
    }

    const getDeadTime = () => {
        let deadline = new Date();

        deadline.setSeconds(deadline.getSeconds() + +startValue);
        return deadline;
    }

    useEffect(() => {
        restartTimerFun(() => restartTimer(String(getDeadTime())))
        stopTimerFun(() => stopTimer())
    }, []);


    return (
        <div className="timer">
            <span>{timer}</span>
        </div>
    )
};

export {Timer};
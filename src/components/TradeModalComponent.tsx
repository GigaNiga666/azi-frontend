import React, {FC, useRef} from 'react';
import {GameStates} from "../types/GameStates";
import {Timer} from "./Timer";

interface TradeModalComponentProps {
    minRaise : number,
    maxRaise : number,
    inputValue : number,
    setInputValue : (value : number) => void,
    myCoins : number,
    myBet : number,
    active : boolean,
    bet : (value : number, action : string) => void,
    minBet : number,
    step : number,
    gameState : GameStates,
    canUpBet : boolean,
    canCallBet : boolean,
    descBet : number,
}

const TradeModalComponent: FC<TradeModalComponentProps> = ({descBet, canCallBet,canUpBet,gameState ,step,inputValue,setInputValue,myCoins,maxRaise,minRaise,myBet, active, bet, minBet}) => {

    const input = useRef<HTMLInputElement>(null);
    const inputMinValue = canCallBet ? minRaise - step : minRaise;

    function click(value : number, action : string) {
        if (input.current) input.current.style.background = '#0B0B0E'
        bet(value,action)
    }

    return (

        <div className={`tradeModal ${active ? 'tradeModal--active' : ''}`}>
            <div className='tradeModal__window'>
                {canUpBet ? <div className='tradeModal__input'>
                        <input
                        type="range" min={inputMinValue}
                        step={step} ref={input}
                        max={maxRaise} value={inputValue}
                        onInput={(e) => {
                            setInputValue(+e.currentTarget.value)
                            const percent = (+e.currentTarget.value - inputMinValue) / (maxRaise - inputMinValue) * 100
                            e.currentTarget.style.background = `linear-gradient(90deg, rgba(0,0,0,0) ${percent}%, #0B0B0E ${percent}%), linear-gradient(270deg, #FF6B00 -0.09%, rgba(255, 107, 0, 0.00) 100.12%), linear-gradient(180deg, #EBC57A -157.14%, #E29A0C 309.52%)`
                        }}
                    />
                </div> : null}
                <div className='tradeModal__buttons'>
                    <button onClick={() => click(0, 'pass')} className='tradeModal__btn tradeModal__btn--red'>Сбросить</button>
                    {
                        inputValue === myCoins ?
                            <button onClick={() => click(myCoins, 'allIn')} className='tradeModal__btn tradeModal__btn--green'>ВА-БАНК</button> :
                        inputValue === minRaise - step && canCallBet ?
                            <button onClick={() => click(descBet - myBet, 'call')} className='tradeModal__btn tradeModal__btn--green'>
                                Уровнять - {descBet >= 1000 ? descBet / 1000 + 'k' :descBet}
                            </button> :
                            <button onClick={() => click(inputValue, 'raise')} className='tradeModal__btn tradeModal__btn--green'>{inputValue}</button>
                    }
                </div>
            </div>
        </div>
    );
};


export {TradeModalComponent};
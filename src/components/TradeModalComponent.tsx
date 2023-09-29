import React, {FC, useRef} from 'react';
import {GameStates} from "../types/GameStates";
import {Direction, getTrackBackground, Range} from "react-range";

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
                {canUpBet ? <div className="tradeModal__input">
                    <Range
                        values={[inputValue]}
                        onChange={([values]) => setInputValue(values)}
                        min={inputMinValue}
                        max={maxRaise}
                        step={10}
                        direction={Direction.Up}
                        renderTrack={({props, children}) => (
                            <div
                                {...props}
                                style={{
                                    ...props.style,
                                    height: '177px',
                                    width: '8px',
                                    borderRadius: '17px',
                                    background: `linear-gradient(to top, rgba(0,0,0,0) ${(inputValue - inputMinValue) / (maxRaise - inputMinValue) * 100}%, #0B0B0E ${(inputValue - inputMinValue) / (maxRaise - inputMinValue) * 100}%), linear-gradient(180deg, #FF6B00 -0.09%, rgba(255, 107, 0, 0.00) 100.12%), linear-gradient(180deg, #EBC57A -157.14%, #E29A0C 309.52%)`
                                }}
                            >
                                {children}
                            </div>
                        )}
                        renderThumb={({props, isDragged}) => (
                            <div
                                id='thumb'
                                {...props}
                                style={{
                                    ...props.style,
                                    height: '44px',
                                    width: '44px',
                                    display:'flex',
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}
                                children={
                                    <div style={{
                                    height: '22px',
                                    width: '22px',
                                    background: 'linear-gradient(180deg, #EBC57A -64.94%, #E29A0C 140.8%), #FFF',
                                    borderRadius: '50%',
                                }} />}
                            />
                        )}
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
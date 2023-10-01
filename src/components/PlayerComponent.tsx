import React, {FC} from 'react';
import playerLogo from '../assets/images/playerImage2.jpg'
import addPlayer from '../assets/images/addPlayer.svg'
import coins from '../assets/images/icons/coins.svg'
import {IPlayer} from "../types/Player";
import {CardImage} from "../ui/CardImage";
import backCard from '../assets/images/backCard.svg'
import {Timer} from "./Timer";

interface PlayerComponentProps {
    player : IPlayer,
    position : string,
    inverse? : boolean
}

const PlayerComponent: FC<PlayerComponentProps> = ({player,position, inverse}) => {
    if (!player) return (
        <div className='player__none'>
            <img className='player__none-img' src={addPlayer} alt=""/>
        </div>
    );

    let action;

    switch (player.action) {
        case 'raise': action = 'Поднял'
            break
        case 'call': action = 'Уровнял'
            break
        case 'allIn' : action = 'Ва-банк'
            break
        case 'round' : action = 'Раунд'
            break
    }

    return (
        <div className={`player ${!player.active ? 'player__inactive' : ''}`}>
            <div className={`player__img ${player.move ? 'border' : ''}`}>
                <img src={playerLogo} alt="playerImage"/>
                <Timer active={player.move} style={'timer__player'}/>
            </div>
            <span className="player__name">{player.username}</span>
            <div className="player__coins">
                <span className="player__coins-value">{player.coins}</span>
                <img className='player__coins-icon' src={coins} alt="coins"/>
            </div>
            <div className='player__cards'>
                {player.cards?.length === 3 ? <img className={`player__card player__card--first ${inverse ? 'inverse' : ''}`} src={backCard} alt="player card"/> : null}
                {player.cards?.length > 0 ? <img className={`player__card player__card--second ${inverse ? 'inverse' : ''}`} src={backCard} alt="player card"/> : null}
                {player.cards?.length >= 2 ? <img className={`player__card player__card--third ${inverse ? 'inverse' : ''}`} src={backCard} alt="player card"/> : null}
            </div>
            {action ? <div className={`player__action player__action--${player.action}`}>{action}</div> : null}
            <CardImage card={player.movedCard} className={`player__movedCard ${position}`}/>
        </div>
    );
};

export {PlayerComponent};
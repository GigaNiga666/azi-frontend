import React, {FC} from 'react';
import {ICard} from "../types/Card";

interface CardImageProps {
    className? : string,
    card : ICard | null
}

const CardImage: FC<CardImageProps> = ({className, card}) => {
    if (!card) return null

    let value;

    switch (card?.value) {
        case 6 : value = 6
            break
        case 7 : value = 7
            break
        case 8 : value = 8
            break
        case 9 : value = 9
            break
        case 10 : value = 10
            break
        case 11 : value = 'jack'
            break
        case 12 : value = 'queen'
            break
        case 13 : value = 'king'
            break
        case 14 : value = 'ace'
            break
    }

    return (
        <img className={className} src={`./cards/${value}_of_${card.suit}.svg`} alt=""/>
    );
};

export {CardImage};
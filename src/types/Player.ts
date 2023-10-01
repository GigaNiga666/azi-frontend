import {ICard} from "./Card";

export interface IPlayer {
    username : string,
    coins : number,
    id : string,
    cards : ICard[],
    movedCard : ICard | null,
    move : boolean,
    active : boolean,
    payoff : number,
    bet : number,
    action : string,
    queryId : string
}
import {Suits} from "./Suits";

export interface ICard {
    suit : Suits,
    value : number,
    canMove? : boolean
}
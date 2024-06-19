import { Card } from "./cars";
import { Deck } from "./deck";
import { Player } from "./player";

export interface GameState{
    deck:Deck
    player:Player
    computer:Player
    tableCards:Card[]
    lastOne: number
    isPlayerTurn: boolean
}
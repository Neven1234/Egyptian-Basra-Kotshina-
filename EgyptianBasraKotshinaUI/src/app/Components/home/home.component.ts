import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GameState } from '../../Models/gameState';
import { BasraService } from '../../_services/basra.service';
import { Card } from '../../Models/cars';
import { CatComponent } from '../cat/cat.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  loading:boolean=true;
  gameState:GameState;
  gameStarted: boolean = false;
  gameFinished:boolean=false;
  CatTurn:boolean=false
  CatWin:boolean=false
  CatLost:boolean=false
  Draw:boolean=false
  newGame:boolean=false
  GameWinnerCheck:number
  constructor(private gamseServices:BasraService){}
  ngOnInit(): void {
  
  }


  startNewGame(){
    this.gameFinished=false
    this.gameStarted = true;
    this.CatLost=false;
    this.CatWin=false;
    this.CatTurn=false;
    console.log('new game repeat?'+ this.newGame)
    this.gamseServices.startGame().subscribe({
      next:(response)=>{
        this.loading=false
        this.gameState=response
      },
      error:(error)=>{
        console.log('error '+error)
      }
    })
  }
  getCardStyle(index: number): any {
    const angle = (index - (this.gameState.player.hand.length - 1) / 2) * 10; // Adjust the multiplier to control spread
    return {
      transform: `rotate(${angle}deg)`,
      zIndex: index,
      cursor: this.gameState.isPlayerTurn ? 'pointer' : 'default'
    };
  }
  
  getDeckCardStyle(index: number): any {
    return {
      top: `${index * 5}px`, // Adjust this to control spacing between cards
      zIndex: index,
    };
  }

  onCardClick(card: Card): void {
    if(this.gameState.isPlayerTurn){
      this.gameState.isPlayerTurn=false
      this.CatTurn=false
      this.gameState.tableCards.push(card)
      var playerCard = this.gameState.player.hand.findIndex(c => c.value === card.value && c.suits === card.suits);
    if (playerCard !== -1) {
      this.gameState.player.hand.splice(playerCard, 1);
    }
      this.gamseServices.PlayerTurn(card).subscribe({
        next:(response)=>{
          setTimeout(() => {
            this.gameState=response.gameState
          }, 1000);
          this.CatTurn=true
           setTimeout(() => {
            this.gamseServices.CatTurn().subscribe({
              next:(response)=>{
                const copCardIndex = this.gameState.computer.hand.findIndex(c => c.value === response.cardPlayed.value && c.suits === response.cardPlayed.suits);           
                if (copCardIndex !== -1) {
                  this.gameState.computer.hand.splice(copCardIndex, 1);
                }
                this.gameState.tableCards.push(response.cardPlayed)              
                setTimeout(() => {
                  this.gameState=response.gameState
                  if(this.gameState?.deck.cards.length==0 && this.gameState?.player.hand.length==0
                    && this.gameState?.computer.hand.length==0 && this.gameState?.tableCards.length==0){
                      console.log('game finished')
                      this.GameWinner()
                  }
                }, 1000);
              }
            })
           },2000)
          
        }
      })
    }
    
  }

  GameWinner(){
    
    this.gamseServices.CheckWiner().subscribe({
      next:(response)=>{
        if(response==0){
          this.GameWinnerCheck=0
          this.CatWin=true
        }
        else if(response==1){
          this.GameWinnerCheck=1
          this.CatLost=true
        }
        else{
          this.GameWinnerCheck=1
          this.Draw=true
        }
      }
    })
    this.gameFinished=true
    console.log(this.gameFinished)
  }

  onGameRestart(): void {
    this.newGame = true; 
  }
}

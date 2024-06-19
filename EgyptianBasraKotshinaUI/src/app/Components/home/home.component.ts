import { Component, OnInit, ViewChild } from '@angular/core';
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
  gameState:GameState;
  constructor(private gamseServices:BasraService){}
  ngOnInit(): void {
    this.startNewGame()
  }

  startNewGame(){
    this.gamseServices.startGame().subscribe({
      next:(response)=>{
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
           setTimeout(() => {
            this.gamseServices.CatTurn().subscribe({
              next:(response)=>{
                const copCardIndex = this.gameState.computer.hand.findIndex(c => c.value === response.cardPlayed.value && c.suits === response.cardPlayed.suits);
                console.log('index: ' + copCardIndex);

                // Check if the card exists in the computer's hand
                if (copCardIndex !== -1) {
                  // Remove the card from the computer's hand array
                  this.gameState.computer.hand.splice(copCardIndex, 1);
                }
                this.gameState.tableCards.push(response.cardPlayed)
               
                setTimeout(() => {
                  this.gameState=response.gameState
                }, 1000);
              }
            })
           },2000)
          
        }
      })
    }
    
  }


}

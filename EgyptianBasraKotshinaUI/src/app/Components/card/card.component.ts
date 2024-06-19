import { Component, Input } from '@angular/core';
import { Card } from '../../Models/cars';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() Playercards: Card[] = [];
  @Input() TableCards:Card[]=[];
  @Input()ComputerCards:Card[]=[]
  @Input()isPlayerTurn:boolean=true;
  getCardStyle(index: number): any {
    const angle = (index - (this.Playercards.length - 1) / 2) * 10; // Adjust the multiplier to control spread
    return {
      transform: `rotate(${angle}deg)`,
      zIndex: index,
      cursor: this.isPlayerTurn ? 'pointer' : 'default'
    };
  }
  
  onCardClick2(card: Card): void {
    alert(`You clicked on card: ${card.value} of ${card.suits}`);
  }
}

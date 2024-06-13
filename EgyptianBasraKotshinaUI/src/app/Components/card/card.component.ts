import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() Playercards: string[] = [];
  @Input() TableCards:string[]=[];
  @Input()ComputerCards:string[]=[]
  getCardStyle(index: number): any {
    const angle = (index - (this.Playercards.length - 1) / 2) * 10; // Adjust the multiplier to control spread
    return {
      transform: `rotate(${angle}deg)`,
      zIndex: index,
    };
  }
  onCardClick(card: string): void {
    alert(`You clicked on card: ${card}`);
  }
}

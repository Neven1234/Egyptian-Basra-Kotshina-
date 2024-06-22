import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.component.html',
  styleUrl: './repeat.component.css'
})
export class RepeatComponent {
  @Output() startGameEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() GameWinner:number
  @Output() startNewGame: EventEmitter<void> = new EventEmitter<void>();
  
  startGame(): void {
    this.startGameEvent.emit();
    this.startNewGame.emit(); 
  }

}

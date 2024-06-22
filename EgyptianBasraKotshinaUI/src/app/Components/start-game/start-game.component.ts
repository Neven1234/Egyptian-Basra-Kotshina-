import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrl: './start-game.component.css'
})
export class StartGameComponent {
  @Output() startGameEvent: EventEmitter<void> = new EventEmitter<void>();
  startGame(): void {
    this.startGameEvent.emit();
  }
}

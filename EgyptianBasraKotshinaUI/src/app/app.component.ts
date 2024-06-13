import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'EgyptianBasraKotshinaUI';
  playerCards = ['A♠', '2♠', '3♠', '4♠', '5♠'];
  TableCards = ['B♠', '4♠', '3♠', '4♠', '5♠'];
  ComputerCards = ['C♠', '4♠', '3♠', '4♠', '5♠'];
}

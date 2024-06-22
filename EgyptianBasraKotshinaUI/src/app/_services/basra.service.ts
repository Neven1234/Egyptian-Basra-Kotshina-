import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameState } from '../Models/gameState';
import { environment } from '../../environments/environment';
import { Card } from '../Models/cars';

@Injectable({
  providedIn: 'root'
})
export class BasraService {

  constructor(private http:HttpClient) { }
  baseUrl=environment.baseUrl
  public startGame():Observable<GameState>{
    return this.http.get<GameState>(this.baseUrl+'api/Game/new-game')
  }
  public PlayerTurn(card:Card):Observable<{ cardPlayed: Card, gameState: GameState }>{
    return this.http.post<{ cardPlayed: Card, gameState: GameState }>(this.baseUrl+'api/Game/player-turn',card)
  }
  public CatTurn():Observable<{ cardPlayed: Card, gameState: GameState }>{
    return this.http.post<{ cardPlayed: Card, gameState: GameState }>(this.baseUrl+'api/Game/computer-turn',{})
  }
  public CheckWiner(){
    return this.http.get(this.baseUrl+'api/Game/check-winner')
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CatComponent } from './Components/cat/cat.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './Components/home/home.component';
import { StartGameComponent } from './Components/start-game/start-game.component';
import { RepeatComponent } from './Components/repeat/repeat.component';

@NgModule({
  declarations: [
    AppComponent,
    CatComponent,
    HomeComponent,
    StartGameComponent,
    RepeatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

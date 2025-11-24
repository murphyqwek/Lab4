import { Component, signal } from '@angular/core';
import { Header } from './components/header/header';
import { Credentials } from "./components/credentials/credentials";
import { Main } from "./components/main/main";

@Component({
  selector: 'app-root',
  imports: [Header, Main, Credentials],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}

import { Component, signal } from '@angular/core';
import { Header } from './components/header/header';
import { Credentials } from "./components/credentials/credentials";

@Component({
  selector: 'app-root',
  imports: [Header, Credentials],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}

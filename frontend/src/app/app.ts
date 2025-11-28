import { Component, signal } from '@angular/core';
import { Header } from './components/header/header';
import { Credentials } from "./components/credentials/credentials";
import { Main } from "./components/main/main";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}

import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mainheader',
  imports: [],
  templateUrl: './mainheader.html',
  styleUrl: './mainheader.scss',
})
export class Mainheader {
  @Input() username: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['login'])
  }
}

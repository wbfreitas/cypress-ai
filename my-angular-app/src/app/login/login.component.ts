import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    // validação simples: qualquer email/senha
    if (this.email && this.password) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Informe email e senha');
    }
  }
}
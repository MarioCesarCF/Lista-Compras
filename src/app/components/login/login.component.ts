import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { API_PATH } from '../../models/environment/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router,
    private httpClient: HttpClient
  ) {}

  async login(): Promise<void> {
    const email = this.email;
    const password = this.password;

    await this.httpClient.post(`${API_PATH}/user/login`, { email, password })
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userName', response.userName);
          localStorage.setItem('userId', response.userId);

          this.router.navigate(['/home']);
        },
        error: () => {
          alert('Usuário ou senha inválidos');
        }
      });
  }
}

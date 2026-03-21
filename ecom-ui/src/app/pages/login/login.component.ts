import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-page d-flex align-items-center justify-content-center">
      <div class="login-card">

        <h2 class="text-center mb-4 fw-bold">🔐 Welcome Back</h2>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">

          <!-- 👤 Username -->
          <div class="form-group mb-3">
            <input 
              type="text"
              class="form-control"
              placeholder="Username"
              formControlName="username">
            
            <div class="error" *ngIf="submitted && username?.hasError('required')">
              Username is required
            </div>
          </div>

          <!-- 🔑 Password -->
          <div class="form-group mb-3 position-relative">
            <input 
              [type]="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Password"
              formControlName="password">

            <span 
              class="toggle-password"
              (click)="showPassword = !showPassword">
              {{ showPassword ? '🙈' : '👁️' }}
            </span>

            <div class="error" *ngIf="submitted && password?.hasError('required')">
              Password is required
            </div>
          </div>

          <!-- ❌ Error -->
          <div *ngIf="errorMessage" class="alert alert-danger py-2">
            {{ errorMessage }}
          </div>

          <!-- 🔘 Button -->
          <button 
            type="submit"
            class="btn btn-primary w-100 mt-2"
            [disabled]="loading">

            <span *ngIf="!loading">Login</span>

            <span *ngIf="loading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Logging in...
            </span>

          </button>

        </form>

        <!-- 🔗 Register -->
        <p class="text-center mt-3 small">
          Don't have an account? 
          <a routerLink="/register">Register</a>
        </p>

      </div>
    </div>
  `,
  styles: [`
    /* 🌈 Background */
    .login-page {
      height: 100vh;
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    /* 🧾 Card */
    .login-card {
      width: 100%;
      max-width: 400px;
      background: white;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }

    /* 🔤 Input */
    .form-control {
      border-radius: 10px;
      padding: 10px 12px;
    }

    /* 👁️ Password toggle */
    .toggle-password {
      position: absolute;
      right: 12px;
      top: 10px;
      cursor: pointer;
    }

    /* ❌ Error */
    .error {
      color: red;
      font-size: 12px;
      margin-top: 4px;
    }
  `]
})
export class LoginComponent {

  loginForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) return;

    this.loading = true;
    const user: User = this.loginForm.value;

    this.authService.login(user).subscribe({
      next: () => {
        this.authService.basic_auth(user.username || '', user.password || '');
        this.authService.setCurrentUser(user);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
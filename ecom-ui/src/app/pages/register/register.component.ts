import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row justify-content-center mt-5">
      <div class="col-md-6">
        <div class="card shadow-lg">
          <div class="card-body p-5">
            <h2 class="card-title text-center mb-4">Register</h2>
            
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="username"
                  formControlName="username"
                  required>
                <div class="text-danger small mt-1" *ngIf="submitted && username?.hasError('required')">
                  Username is required
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password"
                  formControlName="password"
                  required>
                <div class="text-danger small mt-1" *ngIf="submitted && password?.hasError('required')">
                  Password is required
                </div>
                <small class="form-text text-muted">Minimum 8 characters</small>
              </div>

              <div class="mb-3">
                <label for="role" class="form-label">Role</label>
                <select 
                  class="form-select" 
                  id="role"
                  formControlName="role"
                  required>
                  <option value="">Select a role</option>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <div class="text-danger small mt-1" *ngIf="submitted && role?.hasError('required')">
                  Role is required
                </div>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
              </div>

              <div *ngIf="successMessage" class="alert alert-success" role="alert">
                {{ successMessage }}
              </div>

              <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
                <span *ngIf="!loading">Register</span>
                <span *ngIf="loading">
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Registering...
                </span>
              </button>
            </form>

            <p class="text-center mt-3">
              Already have an account? <a routerLink="/login">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['USER', Validators.required]
    });
  }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get role() {
    return this.registerForm.get('role');
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const user: User = this.registerForm.value;

    this.authService.register(user).subscribe({
      next: (response: any) => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error: any) => {
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}

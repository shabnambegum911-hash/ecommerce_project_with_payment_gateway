# Angular UI Development Guide

Complete development guide for the e-commerce Angular frontend application.

## Table of Contents

1. [Development Environment](#development-environment)
2. [Project Structure](#project-structure)
3. [Component Development](#component-development)
4. [Service Development](#service-development)
5. [Styling Guidelines](#styling-guidelines)
6. [Testing](#testing)
7. [Performance Optimization](#performance-optimization)
8. [Debugging](#debugging)
9. [Common Patterns](#common-patterns)
10. [Troubleshooting](#troubleshooting)

## Development Environment

### Required Software

- **Node.js**: v18.x or higher
  ```bash
  node --version
  ```

- **npm**: v9.x or higher
  ```bash
  npm --version
  ```

- **Angular CLI**: v17.x (optional but recommended)
  ```bash
  npm install -g @angular/cli@17
  ng version
  ```

- **Visual Studio Code** (recommended)
  - Extensions: Angular Language Service, Prettier, ESLint

### Setup Development Environment

```bash
# Clone repository
cd ecom-proj-master

# Navigate to frontend
cd ecom-ui

# Install dependencies
npm install

# Start development server
npm start

# Open browser
# Navigate to http://localhost:4200
```

### IDE Extensions (Visual Studio Code)

```json
{
  "recommendations": [
    "Angular.ng-template",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json-languagedetails"
  ]
}
```

## Project Structure

```
ecom-ui/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── navbar/
│   │   │       ├── navbar.component.ts
│   │   │       ├── navbar.component.html
│   │   │       └── navbar.component.css
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── products/
│   │   │   ├── product-detail/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── orders/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── product.service.ts
│   │   │   ├── cart.service.ts
│   │   │   ├── order.service.ts
│   │   │   └── payment.service.ts
│   │   ├── models/
│   │   │   └── index.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   ├── app.routes.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── app.component.css
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── main.ts
│   ├── index.html
│   └── styles.css
├── package.json
├── angular.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── karma.conf.js
├── README.md
├── QUICKSTART.md
└── .gitignore
```

## Component Development

### Component Structure

Every component should follow this pattern:

```typescript
// my-feature.component.ts
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyService } from '../../services/my.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-feature',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './my-feature.component.html',
  styleUrls: ['./my-feature.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyFeatureComponent implements OnInit {
  data$: Observable<any>;

  constructor(private myService: MyService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.data$ = this.myService.getData();
  }
}
```

### Component Best Practices

1. **Use Standalone Components** (Angular 14+)
   ```typescript
   @Component({
     selector: 'app-example',
     standalone: true,
     imports: [CommonModule]
   })
   ```

2. **Implement OnInit**
   ```typescript
   export class MyComponent implements OnInit {
     ngOnInit(): void {
       // Initialize component
     }
   }
   ```

3. **Use ChangeDetectionStrategy.OnPush**
   ```typescript
   changeDetection: ChangeDetectionStrategy.OnPush
   ```

4. **Use Observables** instead of promises
   ```typescript
   data$: Observable<Data> = this.service.getData();
   ```

5. **Unsubscribe** from observables
   ```typescript
   private destroy$ = new Subject<void>();

   ngOnInit() {
     this.data$.pipe(
       takeUntil(this.destroy$)
     ).subscribe(...);
   }

   ngOnDestroy(): void {
     this.destroy$.next();
     this.destroy$.complete();
   }
   ```

### Creating a New Component

```bash
# Using Angular CLI
ng generate component pages/my-new-page

# Manual creation
1. Create folder: src/app/pages/my-new-page/
2. Create TypeScript file: my-new-page.component.ts
3. Create HTML file: my-new-page.component.html
4. Create CSS file: my-new-page.component.css
```

### Template Examples

**Form Binding:**
```html
<form [formGroup]="form" (ngSubmit)="submit()">
  <input type="email" formControlName="email" />
  <button type="submit" [disabled]="form.invalid">Submit</button>
</form>
```

**Conditional Rendering:**
```html
<div *ngIf="isLoading$ | async as loading; else content">
  Loading...
</div>
<ng-template #content>
  <div>{{ data | json }}</div>
</ng-template>
```

**List Rendering:**
```html
<div *ngFor="let item of items$ | async">
  {{ item.name }} - ${{ item.price }}
</div>
```

**Event Binding:**
```html
<button (click)="addToCart(product.id)">Add to Cart</button>
<input (change)="updateQuantity($event)" />
```

## Service Development

### Service Structure

```typescript
// my.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  private apiUrl = `${environment.apiUrl}/my-endpoint`;
  private cache$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching data:', error);
        throw error;
      })
    );
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateData(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteData(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### HTTP Methods

```typescript
// GET request
this.http.get<T>(url)

// POST request
this.http.post<T>(url, body)

// PUT request
this.http.put<T>(url, body)

// DELETE request
this.http.delete<T>(url)

// GET with parameters
this.http.get<T>(url, { params: { key: value } })

// With headers
this.http.get<T>(url, { headers: new HttpHeaders({ 'Authorization': token }) })
```

### Error Handling

```typescript
getData(): Observable<any> {
  return this.http.get<any>(this.apiUrl).pipe(
    catchError(error => {
      if (error.status === 404) {
        console.error('Not found');
      } else if (error.status === 401) {
        console.error('Unauthorized');
      } else if (error.status === 500) {
        console.error('Server error');
      }
      return throwError(() => new Error('Failed to load data'));
    })
  );
}
```

### Creating a New Service

```bash
# Using Angular CLI
ng generate service services/my-new-service

# Manual creation
1. Create file: src/app/services/my-new-service.service.ts
2. Decorate with @Injectable({ providedIn: 'root' })
3. Inject HttpClient
4. Implement methods
```

## Styling Guidelines

### Global Styles

Edit `src/styles.css` for application-wide styles:

```css
/* Variables */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
}

/* Reset styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

/* Utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
```

### Component Styles

```css
/* my.component.css */
:host {
  display: block;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .card {
    padding: 15px;
  }
}
```

### Bootstrap Integration

```html
<!-- Bootstrap classes -->
<div class="container-fluid">
  <div class="row">
    <div class="col-md-6">
      <div class="card">
        <h5 class="card-title">Title</h5>
        <p class="card-text">Content</p>
      </div>
    </div>
  </div>
</div>
```

## Testing

### Unit Testing with Jasmine/Karma

```typescript
// my.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';
import { MyService } from '../../services/my.service';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let mockService: jasmine.SpyObj<MyService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('MyService', ['getData']);

    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [
        { provide: MyService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on init', () => {
    mockService.getData.and.returnValue(of([{ id: 1, name: 'Test' }]));
    fixture.detectChanges();
    expect(mockService.getData).toHaveBeenCalled();
  });
});
```

### Run Tests

```bash
# Run all tests
npm test

# Run specific test file
ng test --include='**/my.component.spec.ts'

# Run with code coverage
ng test --code-coverage

# View coverage report
open coverage/index.html
```

## Performance Optimization

### 1. Lazy Loading Routes

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component')
      .then(m => m.ProductsComponent)
  }
];
```

### 2. Change Detection Strategy

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 3. Unsubscribe from Observables

```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.getData().pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.data = data);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### 4. Track by Function

```html
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

```typescript
trackByFn(index: number, item: any): any {
  return item.id;
}
```

### 5. Async Pipe

```html
<div *ngIf="data$ | async as data">
  {{ data.name }}
</div>
```

## Debugging

### Browser DevTools

1. **Open DevTools**: `F12` or `Ctrl+Shift+I`
2. **Sources Tab**: Set breakpoints
3. **Console Tab**: Log messages and errors
4. **Network Tab**: Monitor API calls
5. **Application Tab**: View localStorage

### VS Code Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverride": {
        "webpack:///src/*": "${webspaceFolder}/src/*"
      }
    }
  ]
}
```

### Logging

```typescript
// Create logger utility
export class LoggerService {
  log(message: string, data?: any): void {
    console.log(`[LOG] ${message}`, data);
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error);
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data);
  }
}
```

## Common Patterns

### State Management with BehaviorSubject

```typescript
export class CounterService {
  private count$ = new BehaviorSubject<number>(0);
  public count: Observable<number> = this.count$.asObservable();

  increment(): void {
    this.count$.next(this.count$.value + 1);
  }

  decrement(): void {
    this.count$.next(this.count$.value - 1);
  }
}
```

### Modal Dialog Pattern

```typescript
// Open modal
@ViewChild('modalRef') modalRef!: TemplateRef<any>;

openModal(): void {
  this.modalService.open(this.modalRef);
}

// In template
<ng-template #modalRef let-modal>
  <div class="modal-dialog">
    <div class="modal-content">
      <button (click)="modal.dismiss()">Close</button>
    </div>
  </div>
</ng-template>
```

### Form Validation

```typescript
form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
  confirmPassword: ['']
}, { validators: this.passwordMatchValidator });

passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { 'passwordMismatch': true };
}

get email() { return this.form.get('email'); }
get password() { return this.form.get('password'); }
```

## Troubleshooting

### Common Issues and Solutions

#### 1. **Module Not Found**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. **Port 4200 Already in Use**
```bash
# Solution: Use different port
ng serve --port 4201

# Or kill process on port 4200
# Windows: netstat -ano | findstr :4200
# Mac/Linux: lsof -i :4200
```

#### 3. **CORS Errors**
- Ensure backend is running on `http://localhost:8080`
- Check API URL in `environment.ts`
- Update backend CORS configuration

```typescript
// environment.ts
apiUrl: 'http://localhost:8080/api'
```

#### 4. **Build Errors**
```bash
# Clear Angular cache
ng cache clean

# Reinstall packages
npm install

# Try fresh build
ng build
```

#### 5. **HTTP 401 Unauthorized**
- User not logged in
- Token expired
- Check browser localStorage
- Re-login to refresh token

#### 6. **Stripe Not Loading**
- Check publishable key in `environment.ts`
- Ensure key starts with `pk_test_` or `pk_live_`
- Verify internet connection

## Development Workflow

### Creating a Feature

1. **Create Component**
   ```bash
   ng generate component pages/my-feature
   ```

2. **Create Service**
   ```bash
   ng generate service services/my-feature
   ```

3. **Create Model** (if needed)
   ```typescript
   // models/index.ts
   export interface MyFeature {
     id: number;
     name: string;
   }
   ```

4. **Add Routing**
   ```typescript
   // app.routes.ts
   {
     path: 'my-feature',
     loadComponent: () => import('./pages/my-feature/my-feature.component')
       .then(m => m.MyFeatureComponent)
   }
   ```

5. **Implement Component**
6. **Implement Service**
7. **Add Tests**
8. **Test Locally**

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push to remote
git push origin feature/my-feature

# Create pull request
```

## Resources

- [Angular Documentation](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.0/)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular Material](https://material.angular.io/)

---

Happy coding! 🎉

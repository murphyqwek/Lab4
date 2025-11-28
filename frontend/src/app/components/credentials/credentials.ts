import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsPayload } from '../../interfaces/credential.payload';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-credentials',
  imports: [ReactiveFormsModule],
  templateUrl: './credentials.html',
  styleUrl: './credentials.scss',
})
export class Credentials implements OnInit {
  credForm: FormGroup;

  isLogin = signal(false)

  isPasswordError = signal(false)
  isLoginError = signal(false)
  
  passwordError = signal('')
  loginError = signal('')

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.credForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      repeatPassword: ['', []],
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe(segments => {
        const currentPath = segments[0]?.path;

        if (currentPath === 'login' || currentPath === '') {
            this.isLogin.set(true);
        } else {
          this.isLogin.set(false);
        }
        

        console.log(currentPath);
    });
  }

  linkClicked() {
    if(this.isLogin()) {
      this.router.navigate(['register']);
    }
    else {
      this.router.navigate(['login']);
    }
  }

  loginInputClicked() {
    this.isLoginError.set(false);

    if(this.isLogin()) {
      this.isPasswordError.set(false);
    }
  }

  passwordInputClicked() {
    this.isPasswordError.set(false);

    if(this.isLogin()) {
      this.isLoginError.set(false);
    }
  }

  onFormSubmit() {
    this.loginError.set('');
    this.passwordError.set('');
    let isLoginValid = this.validateLogin();
    let isPasswordValid = this.validatePassword();
    
    if(!(isLoginValid && isPasswordValid)) {
      return;
    }

    const username = this.credForm.get('username');
    const password = this.credForm.get('password');

    if(username === null || password === null) {
      return;
    }



    const payload: CredentialsPayload = {
      username: username.value,
      password: password.value,
    };

    if(this.isLogin()) {
      this.login(payload);
    } 
    else {
      this.registration(payload);
    }
  }

  private registration(cred: CredentialsPayload) {
     const registration$ = this.authService.register(cred);

    registration$.subscribe({
        next: (token: string) => {
            if (token) {
                this.authService.setToken(token);
                this.router.navigate(['/shoot']);
            } else {
                this.isLoginError.set(true);
                this.loginError.set("Имя пользователя уже занято")
            }
        },
        
        error: (err: HttpErrorResponse) => {
            if(err.status === 409) {
              const errorMessage = 'Имя пользователя уже занято. Попробуйте другое имя';
              
              this.isLoginError.set(true);
              this.loginError.set(errorMessage)
            } else {
              console.log(err.message);
              //TODO:  сделать общие ошибки
            }
        },
    });
  }

  private login(cred: CredentialsPayload) {
    const login$ = this.authService.login(cred);

    login$.subscribe({
      next: (token: string) => {
        if(token) {
          this.authService.setToken(token);
          this.router.navigate(['/shoot']);
        }
        else {
          this.isLoginError.set(true);
          this.isPasswordError.set(true);

          this.passwordError.set("Неверный пароль или логин");
          //TODO:  сделать общие ошибки
        }
      },

      error: (err: HttpErrorResponse) => {
        if(err.status === 400) {
          this.isLoginError.set(true);
          this.isPasswordError.set(true);
          this.passwordError.set("Неверный пароль или логин");
        }
        else {
          console.log(err.message);
          //TODO:  сделать общие ошибки
        }
      }
    })
  }

  validateLogin() {
    const username = this.credForm.get('username');


    if(username?.valid) {
      return true;
    }

    if(username?.errors?.['required']) {
      this.loginError.set('Введите логин\n');
    }
    else if(username?.errors?.['minlength'] || username?.errors?.['maxlength']) {
      this.loginError.set('Логин должен быть от 4 до 15 символов\n');
    }

    this.isLoginError.set(true);

    return false;
  }

  validatePassword() {
    const password = this.credForm.get('password');
    const repeatPassword = this.credForm.get('repeatPassword');

    console.log(repeatPassword?.value);

    if(password?.valid) {
      if(!this.isLogin() && repeatPassword?.valid && password?.value === repeatPassword?.value) {
        return true;
      }
      if(this.isLogin()) {
        return true;
      }
    }

    this.isPasswordError.set(true);

    if(password?.errors?.['required']) {
      this.passwordError.set("Введите пароль");
      return false;
    }
    else if(password?.errors?.['minlength'] || password?.errors?.['maxlength']) {
      this.passwordError.set("Пароль должен быть от 4 до 15 символов");
      return false;
    }

    if(repeatPassword?.errors?.['required']) {
      this.passwordError.update(value => value + "\nПовторите пароль");
    }
    else if(password?.value === repeatPassword?.value) {
      this.passwordError.update(value => value + "\nПароли не совпдают");
    }

    return false;
  }
}

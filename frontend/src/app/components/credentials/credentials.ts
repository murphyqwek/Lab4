import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { repeat } from 'rxjs';

@Component({
  selector: 'app-credentials',
  imports: [ReactiveFormsModule],
  templateUrl: './credentials.html',
  styleUrl: './credentials.scss',
})
export class Credentials {
  credForm: FormGroup;

  isLogin = signal(false)

  isPasswordError = signal(false)
  isLoginError = signal(false)
  
  passwordError = signal('')
  loginError = signal('')

  linkClicked() {
    this.credForm.get("username")?.reset();
    this.credForm.get("password")?.reset();
    this.credForm.get("repeatPassword")?.reset();
    this.isLogin.update(value => !value);
    this.isLoginError.set(false);
    this.isPasswordError.set(false);
    this.loginError.set('');
    this.passwordError.set('');
  }

  loginInputClicked() {
    this.isLoginError.set(false);
    console.log("test");
  }

  passwordInputClicked() {
    this.isPasswordError.set(false);
  }

  onFormSubmit() {
    this.loginError.set('');
    this.passwordError.set('');
    let isLoginValid = this.validateLogin();
    let isPasswordValid = this.validatePassword();
    
    let text = isLoginValid && isPasswordValid ? "Удалось!" : "Не удалось";

    console.log(text);
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

  constructor(fb: FormBuilder) { 
    this.credForm = fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      repeatPassword: ['', [Validators.required]],
    });
  }
}

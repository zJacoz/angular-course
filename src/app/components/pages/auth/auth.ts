import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
  name: string,
  email: string,
  password: string,
}

@Component({
  selector: 'app-auth',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth implements OnInit {
  form!: FormGroup;
  isLoginMode = true;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
  ){}

  ngOnInit(): void {
    this.setupForm();
  }

  setupForm():void {
    this.form = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    })
  }

  toggleMode():void {
    this.isLoginMode = !this.isLoginMode;
  }

  getUsers(): User[] {
    const data = localStorage.getItem('users');
    return data? JSON.parse(data) : [];
  }

  saveUser(list: User[]): void {
    localStorage.setItem('users', JSON.stringify(list));
  }

  onSubmit(): void {
    console.log('Form submit enviado.');
    if(this.form.invalid) return;
    console.log('Form inválido.', this.form.errors);

    const {name, email, password} = this.form.value;
    const users = this.getUsers();

    if(this.isLoginMode) {
      const user = users.find(u => u.email === email && u.password === password);

      if(user) {
        console.log("Login sucedido.");
        localStorage.setItem("userLogged", JSON.stringify(user));
        this.router.navigate(['/home']);
      } else {
        alert("Email ou senha incorretos.");
      }
    } else {
      const userExists = users.some(u => u.email === email);

      if(userExists) {
        alert("Este email já está cadastrado.");
        return;
      }

      if(password.length !== 6) {
        alert("Digite uma senha com exatamente 6 dígitos.");
        return;
      }
      const newUser : User = {name, email, password};
      users.push(newUser);
      this.saveUser(users);
      alert('Cadastro realizado com sucesso.');
      this.toggleMode();
      this.form.reset();
    }


  }

}

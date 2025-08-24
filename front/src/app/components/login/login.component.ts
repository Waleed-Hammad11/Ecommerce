import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private _AuthService:AuthService, private _Router:Router){}
    
  loginForm = new FormGroup({
      email: new FormControl(null,[Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])

    })


    sendData(){
      if(this.loginForm.valid){
        this._AuthService.login(this.loginForm.value).subscribe({
          next:(res)=> {
            console.log(res);
            alert(res.message);
            this._Router.navigate(['/products']);
          },
          error:(err)=> {
            console.log(err.error);
            
          },
          complete() {
            
          },
        })
      }
      
      
    }

}

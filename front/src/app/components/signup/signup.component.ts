import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  standalone: true,

})
export class SignupComponent {
  constructor(private auth:AuthService,private router: Router){}

    register = new FormGroup({
        username: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
        email: new FormControl(null, [Validators.required,Validators.email]),
        password: new FormControl(null, [Validators.required])
    })



sendData(){
  
    this.auth.signup(this.register.value).subscribe({
    next:(data)=>{
      console.log(data);
      alert("Account created! Please check your email to verify.");
      this.router.navigate(['/login']);
    },
    error:(err)=>{
      console.log(err);
      
    }
  })
  
  console.log("enter valid data");
  
}

    
}

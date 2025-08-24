import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
constructor(private auth:AuthService){}

isLoggedIn =true;

  isLogin(){
    let token = localStorage.getItem("token")
    if(token){
    this.isLoggedIn= true
    }else{
      this.isLoggedIn=false
    }
    
  }


  ngOnInit(): void {
    this.isLogin()
    console.log(this.isLoggedIn);
    
  }
  
}

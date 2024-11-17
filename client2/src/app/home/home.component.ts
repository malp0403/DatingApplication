import { Component, inject, input, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{


  http = inject(HttpClient);
  users: any = [];
  registerMode = false;

  ngOnInit(): void {
    this.getUsers();
  }


  registerToggle(){
    this.registerMode = !this.registerMode;
  }

  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err) => console.log(err),
      complete: () => {
        console.log('complete: ');
      },
    });
  }

  cancelRegisterMode(event: any){
    this.registerMode = event;
  }

}

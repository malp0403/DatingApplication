import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  accountService = inject(AccountService);
  usersFromHomeComponet = input.required<any>();
  registerCancel = output<boolean>();
  model: any = {};

  register() {
    this.accountService.register(this.model).subscribe({
      next:(res)=>{
        console.log(res);
        this.cancel();
      },
      error:error=>console.log(error)
    })
  }

  cancel() {
    this.registerCancel.emit(false);
  }
}

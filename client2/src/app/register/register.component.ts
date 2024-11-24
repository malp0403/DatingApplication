import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  accountService = inject(AccountService);
  registerCancel = output<boolean>();
  toastr= inject(ToastrService);
  model: any = {};

  register() {
    this.accountService.register(this.model).subscribe({
      next:(res)=>{
        console.log(res);
        this.cancel();
      },
      error:error=>{
        this.toastr.error(error.error);
        console.log(error)
      }
    })
  }

  cancel() {
    this.registerCancel.emit(false);
  }
}

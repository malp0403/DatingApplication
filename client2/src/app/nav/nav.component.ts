import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  accountService = inject(AccountService);
  router = inject(Router);
  toastr = inject(ToastrService);

  model: any = {};

  login() {
    console.log(this.model);

    this.accountService.login(this.model).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/members');
        console.log(res);
      },
      error: (err) => {
        this.toastr.error(err.error);
        console.log(err);
      },
      complete: () => {
        console.log('login complete');
      },
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('');
  }
}

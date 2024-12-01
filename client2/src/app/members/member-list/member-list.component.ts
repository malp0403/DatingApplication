import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { Member } from '../../models/Member';
import { MemberCardComponent } from "../member-card/member-card.component";
import {PaginationModule} from 'ngx-bootstrap/pagination';
import { UserParams } from '../../models/userParams';
import { AccountService } from '../../services/account.service';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent,PaginationModule,FormsModule,ButtonsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {
  memberService = inject(MembersService);
  pageNumber=1;
  pageSize=3;
  accountService = inject(AccountService);
  userParams = new UserParams(this.accountService.currentUser());

  genderList=[{value:'male',display:'Males'},{value:'female',display:'Females'}]


  ngOnInit(): void {
    if(!this.memberService.paginatedResult())
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.userParams).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }

  resetFilters(){
    this.userParams = new UserParams(this.accountService.currentUser());
    this.loadMembers();
  }

  pageChanged(e:any){
    console.log(e);
    if(this.userParams.pageNumber !=e.page){
      this.userParams.pageNumber = e.page;
      this.loadMembers();
    }
  }
}

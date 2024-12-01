import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AccountService } from '../../services/account.service';
import { MembersService } from '../../services/members.service';
import { Member } from '../../models/Member';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, FormsModule, PhotoEditorComponent],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css',
})
export class MemberEditComponent implements OnInit {
  accountService = inject(AccountService);
  memberService = inject(MembersService);
  private toastr = inject(ToastrService);

  @ViewChild('editForm') editForm?: NgForm;
  // @HostListener('window:beforeunload', ['$event']) notify($event: any) {
  //   if (this.editForm?.dirty) {
  //     $event.returnValue = true;
  //   }
  // }
  member?: Member;

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    let user = this.accountService.currentUser();
    if (!user) return;
    this.memberService.getMember(user.username).subscribe({
      next: (member) => (this.member = member),
    });
  }

  updateMember() {
    console.log(this.member);
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next:res=>{
        this.toastr.success('update successfully!');
        this.editForm?.reset(this.member);
      }
    })

  }

  reloadMember(e:any){
    this.loadMember();
  }
}

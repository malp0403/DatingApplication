import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../models/Member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../services/account.service';
import { environment } from '../../../environments/environment';
import { MembersService } from '../../services/members.service';
import { Photo } from '../../models/Photo';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, NgClass, FileUploadModule,DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css',
})
export class PhotoEditorComponent implements OnInit{
  ngOnInit(): void {
    this.initializeUploader();
  }
  member = input.required<Member>();
  reloadMember= output<boolean>();

  accountService = inject(AccountService);
  memberService= inject(MembersService);
  uploader?: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;
  baseUrl = environment.apiUrl;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo:Photo){
    this.memberService.setMainPhoto(photo.id).subscribe({
      next:res=>{
        this.reloadMember.emit(true);

        // const user = this.accountService.currentUser();
        // if(user){
        //   user.photoUrl = photo.url;
        //   this.accountService.setCurrentUser(user);
        // }

      }
    })
  }

  deletePhoto(photo:Photo){
    this.memberService.deletePhoto(photo.id).subscribe({
      next:res=>{
        console.log('delete ');
        this.reloadMember.emit(true);
      }
    })
  }


  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item,response,status,headers)=>{
      console.log("onSuccessItem: " +response);
      this.reloadMember.emit(true);
    }
  }
}

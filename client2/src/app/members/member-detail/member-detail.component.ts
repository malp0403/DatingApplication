import { ChangeDetectorRef, Component, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../models/Member';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { Message } from '../../models/message';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit{
 cdRef= inject(ChangeDetectorRef);
  memberSerive = inject(MembersService);
  route = inject(ActivatedRoute);
  messageService=inject(MessageService);
  member?:Member ={} as Member;
  images:GalleryItem[] =[];

  @ViewChild('memberTabs') memberTabs?:TabsetComponent;
  activeTab?:TabDirective;
  messages:Message[] = [];
  ngOnInit(): void {
    this.route.data.subscribe({
      next:data=>{
        this.member = data['member'];
        this.images = this.member!.photos.map(p=> new ImageItem({src:p.url, thumb:p.url}));
        this.cdRef.detectChanges();
      }
    })
    // this.loadMember();

    this.route.queryParams.subscribe({
      next: params=>{
        params['tab'] && this.selectTab(params['tab']);
      }
    })
  }

  onTabActivated(data:TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading == 'Message' && this.messages.length ==0 && this.member){
      this.messageService.getMessageThread(this.member.username).subscribe({
        next: (messages) => {
          this.messages = messages;
        },
      });
    }
  }

  selectTab(heading:string){
    if(this.memberTabs){
      const messageTab = this.memberTabs.tabs.find(x=>x.heading == heading);
      if(messageTab) messageTab.active=true;
    }
  }

  onUpdateMessages(e:any){
    this.messageService.getMessageThread(this.member!.username).subscribe({
      next: (messages) => {
        this.messages = messages;
      },
    });
  }
  // loadMember(){
  //   const username = this.route.snapshot.paramMap.get('username');
  //   if(!username) return;
  //   this.memberSerive.getMember(username).subscribe({
  //     next:res=>{
  //       this.member = res;
  //       this.images = res.photos.map(p=> new ImageItem({src:p.url, thumb:p.url}));
  //       // res.photos.map(p=>{
  //       //   this.images.push(new ImageItem({src:p.url, thumb:p.url}));
  //       // })
  //       this.cdRef.detectChanges();
  //     }
  //   })
  // }

}

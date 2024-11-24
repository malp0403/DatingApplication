import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../models/Member';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule,GalleryModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit{
 cdRef= inject(ChangeDetectorRef);
  memberSerive = inject(MembersService);
  route = inject(ActivatedRoute);
  member?:Member;
  images:GalleryItem[] =[];
  
  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    const username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.memberSerive.getMember(username).subscribe({
      next:res=>{
        this.member = res;
        this.images = res.photos.map(p=> new ImageItem({src:p.url, thumb:p.url}));
        // res.photos.map(p=>{
        //   this.images.push(new ImageItem({src:p.url, thumb:p.url}));
        // })
        this.cdRef.detectChanges();
      }
    })
  }

}

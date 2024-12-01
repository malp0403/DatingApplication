import { Component, inject, OnInit } from '@angular/core';
import { LikesService } from '../services/likes.service';
import { Member } from '../models/Member';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MemberCardComponent } from "../members/member-card/member-card.component";

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [FormsModule, ButtonsModule, MemberCardComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
})
export class ListsComponent implements OnInit {
  private likesService = inject(LikesService);
  members: Member[] = [];
  predicate = 'liked';

  ngOnInit(): void {
    this.loadlikes();
  }

  getTitle() {
    switch (this.predicate) {
      case 'liked':
        return 'Members you like';
      case 'likedBy':
        return 'Member who like you';
      default:
        return 'Mutual';
    }
  }

  loadlikes() {
    this.likesService.getLikes(this.predicate).subscribe({
      next: (members) => {
        this.members = members;
      },
    });
  }
}

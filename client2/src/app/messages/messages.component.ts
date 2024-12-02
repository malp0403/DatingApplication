import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { Message } from '../models/message';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [ButtonsModule, FormsModule, RouterLink],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  ngOnInit(): void {
    this.loadMessages();
  }
  messagesService = inject(MessageService);
  container = 'Inbox';
  pageNumber = 1;
  pageSize = 5;

  loadMessages() {
    this.messagesService.getMessages(
      this.pageNumber,
      this.pageSize,
      this.container
    );
  }

  getRoute(message: Message) {
    if (this.container == 'Outbox')
      return `/members/${message.recipientUsername}`;
    else return `/members/${message.senderUsername}`;
  }

  pageChanged(event: any) {
    if (this.pageNumber != event.page) {
      this.pageNumber = event.page;
    }
  }

  deleteMessage(id: number) {
    this.messagesService.deleteMessage(id).subscribe({
      next: (res) => {
        this.loadMessages();
      },
    });
  }
}

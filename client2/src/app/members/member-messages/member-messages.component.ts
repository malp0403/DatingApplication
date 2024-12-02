import { Component, inject, input, OnInit, output, ViewChild } from '@angular/core';
import { Message } from '../../models/message';
import { MessageService } from '../../services/message.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?:NgForm;
  private messageService = inject(MessageService);
  username = input.required<string>();
  messages = input.required<Message[]>();

  messageContent = '';
  updateMessages = output<Message>();

  ngOnInit() {}

  sendMessage() {
    this.messageService
      .sendMessage(this.username(), this.messageContent)
      .subscribe({
        next: (message) => {
          this.updateMessages.emit(message);
          this.messageForm?.reset();
        },
      });
  }
}

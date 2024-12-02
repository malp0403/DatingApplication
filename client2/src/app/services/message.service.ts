import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../models/pagination';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
  constructor() {}

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = this.setPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);

    return this.http
      .get<Message[]>(this.baseUrl + 'messages', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.paginatedResult.set({
            items: res.body as Message[],
            pagination: JSON.parse(res.headers.get('Pagination') ?? ''),
          });
        },
      });
  }

  setPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    return params;
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(
      this.baseUrl + 'messages/thread/' + username
    );
  }

  sendMessage(username: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'messages', {
      RecipientUsername: username,
      content,
    });
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}

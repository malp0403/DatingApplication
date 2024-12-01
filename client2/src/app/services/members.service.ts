import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/Member';
import { AccountService } from './account.service';
import { PaginatedResult } from '../models/pagination';
import { tap } from 'rxjs';
import { UserParams } from '../models/userParams';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  constructor() {}

  getMembers(userParams:UserParams) {
    let params = this.setPaginationHeaders(userParams.pageNumber,userParams.pageSize);


  
      params = params.append('minAge',userParams.minAge);
      params = params.append('maxAge',userParams.maxAge);
      params = params.append('gender',userParams.gender);
      params = params.append('orderBy',userParams.orderBy);


    return this.http.get<Member[]>(this.baseUrl + 'users',{observe:'response',params}).pipe(tap(res=>{
      this.paginatedResult.set({
        items:res.body as Member[],
        pagination:JSON.parse(res.headers.get('Pagination')??"")
      })
    }));
  }

  setPaginationHeaders(pageNumber:number,pageSize:number){
    let params = new HttpParams();
    if(pageNumber&& pageSize){
      params = params.append('pageNumber',pageNumber);
      params = params.append('pageSize',pageSize);
    }

    return params
  }

  getMember(username: string) {
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member:Member){
    return this.http.put(this.baseUrl+'users',member);

  }

  setMainPhoto(photoId:number){
    return this.http.put(this.baseUrl+'users/set-main-photo/'+photoId,{});
  }

  deletePhoto(photoId:number){
    return this.http.delete(this.baseUrl+'users/delete-photo/'+photoId);
  }


}

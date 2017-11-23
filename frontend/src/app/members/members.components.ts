import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: '.bg-member-list',
  template: `
  <div *ngIf="members">
      <h2>Members of {{ orgName }}</h2>
      <ul>
        <li *ngFor="let member of members" style="display: block; height: 80px;" >
          <img src="{{member.avatar_url}}" width="60px" height="60px" style="float:left"> {{ member.login }} (followers: {{member.followers_count}}, following: {{member.following_count}} )
        </li>
      </ul>
  </div>
  `
})

export class MembersListComponent implements OnInit {
  
  @Input() list: BehaviorSubject<any> = new BehaviorSubject([]);
  @Input() orgName: string;

  private members: any[];

  constructor() { 
  }

  ngOnInit(): void {
    if (!this.list) {
      return;
    }
    this.list.subscribe(members => {
      this.members = members; 
    });
  }

}
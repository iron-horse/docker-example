import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OrganizationService } from '../services/organization.service';

@Component({
  selector: '.bg-comment-list',
  template: `
  <div *ngIf="comments">
      <h2>Comments for {{ orgName }}</h2>
      <ul id="comments" >
        <li>
          <input type="text" #newComment style="width: 70%;">
          <button (click)="addNew(newComment)">Submit</button>
        </li>
        <li *ngFor="let comment of comments">
          {{ comment.comment }}
        </li>
      </ul>
  </div>
  `
})

export class CommentsListComponent implements OnInit {
  
  @Input() list: BehaviorSubject<any> = new BehaviorSubject([]);
  @Input() orgName: string;

  private comments: any[];

  constructor(
    private _orgService: OrganizationService
  ) {
  }

  ngOnInit(): void {
    if (!this.list) {
      return;
    }
    this.list.subscribe(comments => {
      this.comments = comments; 
    });
  }

  addNew(newComment: any): void {
    if (!newComment.value.trim()) {
      return;
    }

    this._orgService.addComment(this.orgName, newComment.value).subscribe((isSuccess) => {
    if (!isSuccess) {
      console.error("something went wrong!");
    }
    this.comments.push({
      comment: newComment.value
    });
    newComment.value = "";
    })
  }

}
import { Component, OnDestroy } from '@angular/core';
import { OrganizationService } from '../services/organization.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: '.bg-search-org',
  template: `
  <div style="width:100%; text-align: center;">
      <h2>Search orgs by name</h2>
      <input type=text #orgName>
      <button (click)="getOrganization(orgName.value)">Find</button>
      <button (click)="clear(orgName)">Clear</button>
      <button (click)="deleteOrgData(orgName)">Delete</button>
  </div>
  <div *ngIf="comments" class="bg-comment-list" [orgName]="org" [list]="comments" style="width: 50%; float: left"></div>
  <div *ngIf="members" class="bg-member-list" [orgName]="org" [list]="members" style="width: 50%; float: left"></div>
  `
})
export class SearchComponent implements OnDestroy  {
  
  members: Subject<any>;
  comments: Subject<any>;
  
  private org: string;
  private sub1: Subscription;
  private sub2: Subscription;

  constructor(
    private _orgService: OrganizationService
  ) {
    this.members = new Subject();
    this.comments = new Subject();
  }

  ngOnDestroy(): void {
    this.sub1 && this.sub1.unsubscribe();
    this.sub2 && this.sub2.unsubscribe();
  }

  clear(orgName: any, removeMessage: boolean): void {
    this.members.next(null);
    this.comments.next(null);
    if (removeMessage) {
      alert(`Successfully removed data for ${orgName.value}`);
    }
    orgName.value = "";
  }

  getOrganization(orgName: string): void {
    if (!orgName.trim()) {
      console.error("Please enter name");
      return;
    }

    this.org = orgName;
    this.getComments();
    this.getMembers();
  }

  deleteOrgData(orgName: any): void {
    if (!orgName.value.trim()) {
      return;
    }
    this._orgService.deleteOrgDetails(orgName.value).subscribe((isSuccess) => {
      if (!isSuccess) {
        console.error("Something went wrong");
      }
      this.clear(orgName, true);
    });
  }

  private notValidOrg(): void {
    this.sub1 && this.sub1.unsubscribe();
    this.sub2 && this.sub2.unsubscribe();
    alert("Org you enter is not valid, please try again.");
    this.comments.next(null);
    this.members.next(null);
  }

  private getComments(): void {
    this.comments.next([]);
    this.sub1 = this._orgService.getComments(this.org).subscribe((comments) => {
      this.comments.next(comments);
    });
  }

  private getMembers(): void {
    this.members.next([]);
    this.sub2 = this._orgService.getMembers(this.org).subscribe((members) => {
      if (!Array.isArray(members)) {
        this.notValidOrg();
        return;
      }
      this.members.next(members);
    });
  }


}
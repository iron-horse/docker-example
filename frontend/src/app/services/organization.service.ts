import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CacheService } from './cache.service';

@Injectable()
export class OrganizationService {

  COMMENT_SERVICE_BASE: string = "http://localhost:3000";
  MEMBER_SERVICE_BASE: string = "http://localhost:8080";
  API_BASE: string = "/api/v1/orgs";

  constructor(
    private _http: Http,
    private _cache: CacheService
  ) { }

  getComments(orgName: string, reset: boolean = false): Observable<any> {
    let url: string = this.commentsURL(orgName);

    if ( !reset && this._cache.has(url)) {
      let cacheValue = this._cache.get(url);
      if ( this.lessThanOneHourAgo(cacheValue.at) ) {
        // only use cache if it has been for less than an hour..
        return Observable.of(cacheValue.value);
      }
    }

    return this._http.get(url).map(res => {
      let response = res.json();
      if (response && response.comments) {
        this._cache.set(url, {value: response.comments, at: new Date()});
      }
      return response && response.comments;
    }).catch((error) => {
      console.log(error);
      return Observable.of(null);
    });
  }

  getMembers(orgName: string, reset: boolean = false): Observable<any> {
    let url: string = this.membersURL(orgName);

    if ( !reset && this._cache.has(url)) {
      let cacheValue = this._cache.get(url);
      if ( this.lessThanOneHourAgo(cacheValue.at) ) {
        // only use cache if it has been for less than an hour..
        return Observable.of(cacheValue.value);
      }
    }

    return this._http.get(url).map(res => {
      let response = res.json();
      if (response && response.members) {
        this._cache.set(url, {value: response.members, at: new Date()});
      }
      return response && response.members;
    }).catch((error) => {
      console.log(error);
      return Observable.of(null);
    });
  }

  addComment(orgName: string, comment: string): Observable<any> {
    let url: string = `${this.COMMENT_SERVICE_BASE}${this.API_BASE}/${orgName}/comments`;
    return this._http.post(url, {comment: comment}).map(res => {
      let response = res.json();
      if (response && response.message) {
        let sub1 = this.getComments(orgName, true).subscribe((updated) => {
          // update cache on success in background..
          sub1.unsubscribe();
        });
      }
      return response && response.message;
    }).catch((error) => {
      console.log(error);
      return Observable.of(null);
    });
  }

  deleteOrgDetails(orgName: string): Observable<any> {
    let url: string = `${this.COMMENT_SERVICE_BASE}${this.API_BASE}/${orgName}`;
    return this._http.delete(url).map(res => {
      let response = res.json();
      if (response && response.message) {
        // remove cache values,
        let commentsURL: string = this.commentsURL(orgName);
        let membersURL: string = this.membersURL(orgName);
        this._cache.remove(commentsURL);
        this._cache.remove(membersURL);
      }
      return response && response.message;
    }).catch((error) => {
      console.log(error);
      return Observable.of(null);
    });
  }

  private lessThanOneHourAgo(date: any) {
    const HOUR = 1000 * 60 * 60;
    let anHourAgo = Date.now() - HOUR;
    return date > anHourAgo;
  }

  private commentsURL(orgName: string): string {
    return `${this.COMMENT_SERVICE_BASE}${this.API_BASE}/${orgName}/comments`;
  }

  private membersURL(orgName: string): string {
    return `${this.MEMBER_SERVICE_BASE}${this.API_BASE}/${orgName}/members`;
  }
}
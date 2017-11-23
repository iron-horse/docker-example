import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { SearchComponent } from "./search/search.component";

import { OrganizationService } from './services/organization.service';
import { MembersListComponent } from './members/members.components';
import { CommentsListComponent } from './comments/comments.component';
import { CacheService } from './services/cache.service';

@NgModule({
  imports:      [ BrowserModule, HttpModule ],
  declarations: [
    AppComponent,
    SearchComponent,
    MembersListComponent,
    CommentsListComponent
  ],
  providers: [
    OrganizationService,
    CacheService
  ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
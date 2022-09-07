import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularMaterialModule } from './material-module/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { TableComponent } from './components/table/table.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { configuration } from '../environments/firebase';
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';
import { DisplayDocumentComponent } from './components/display-document/display-document.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    TableComponent,
    EditDialogComponent,
    DisplayDocumentComponent,
    HeaderComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    AngularFireModule.initializeApp(configuration.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

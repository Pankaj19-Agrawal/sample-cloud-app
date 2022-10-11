import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer'
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import { AngularMaterialModule } from './material-module/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { TableComponent } from './components/table/table.component';

import { AngularFireFunctionsModule, REGION, USE_EMULATOR, ORIGIN } from '@angular/fire/compat/functions';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { configuration } from '../environments/firebase';
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';
import { DisplayDocumentComponent } from './components/display-document/display-document.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    TableComponent,
    EditDialogComponent,
    DisplayDocumentComponent,
    HeaderComponent,
    LoginComponent,
    DashboardComponent,
    DeleteDialogComponent
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    AngularFireModule.initializeApp(configuration.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    PdfViewerModule,
    PdfJsViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

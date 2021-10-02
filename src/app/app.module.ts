import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { app_routing } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataTablesModule } from 'angular-datatables';
import { HomeComponent } from './componectes/home/home.component';
import { LoginComponent } from './componectes/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RegistroComponent } from './componectes/registro/registro.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WebcamModule } from 'ngx-webcam';
import { EditarComponent } from './componectes/editar/editar.component';
import { VistaComponent } from './componectes/vista/vista.component';
import { PoncharComponent } from './componectes/ponchar/ponchar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistroComponent,
    EditarComponent,
    VistaComponent,
    PoncharComponent
  ],
  imports: [
    BrowserModule,
    app_routing,
    DataTablesModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    WebcamModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

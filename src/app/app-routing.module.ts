import { HomeComponent } from './componectes/home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './componectes/login/login.component';
import { RegistroComponent } from './componectes/registro/registro.component';
import { EditarComponent } from './componectes/editar/editar.component';
import { VistaComponent } from './componectes/vista/vista.component';
import { PoncharComponent } from './componectes/ponchar/ponchar.component';

const app_routes: Routes = [
  {path: 'ponchar', component: PoncharComponent },
  {path: 'login', component: LoginComponent },
  {path: 'home', component: HomeComponent },
  {path: 'registro', component:RegistroComponent },
  {path: 'editar', component:EditarComponent },
  {path: 'vista', component:VistaComponent },
  {path: '**', pathMatch: 'full', redirectTo: 'ponchar'}
];

export const app_routing = RouterModule.forRoot(app_routes);

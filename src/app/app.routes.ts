import { Routes } from '@angular/router';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { TablaDataComponent } from './components/tabla-data/tabla-data.component';

import { CallbackcuComponent } from './components/callbackcu/callbackcu.component';
import { MisfichasComponent } from './ComponenteReceptores/misfichas/misfichas.component';

export const routes: Routes = [

  // Home
  { path: '', component: TablaDataComponent },

  // Otra ruta
  { path: 'sesion-cedula', component: InicioSesionComponent },

  // LA RUTA DE CALLBACK CLAVEÚNICA
  { path: 'claveunica/callback', component: CallbackcuComponent },

  // Ruta a la que rediriges luego de login
  { path: 'misfichas', component: MisfichasComponent },
    {
        path: 'receptores',
        loadChildren: () =>
          import('./ComponenteReceptores/componente-receptores/componente-receptores.module')
            .then(m => m.ComponenteReceptoresModule),
      },
    { path: '**', redirectTo: '', pathMatch: 'full' }

];

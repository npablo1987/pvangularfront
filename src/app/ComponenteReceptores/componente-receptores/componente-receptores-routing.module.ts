import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponenteReceptoresComponentComponent } from '../componente-receptores-component/componente-receptores-component.component';
import { MisfichasComponent } from '../misfichas/misfichas.component';
import { CrearFichaComponent } from '../crear-ficha/crear-ficha.component';
import { CrearFichaIIComponent } from '../crear-ficha-ii/crear-ficha-ii.component';
import { CrearFichaIIIComponent } from '../crear-ficha-iii/crear-ficha-iii.component';
import { FichasaprobadasComponent } from '../fichasaprobadas/fichasaprobadas.component';
import { FichasrechazadasComponent } from '../fichasrechazadas/fichasrechazadas.component';
import { DirectorioComponent } from '../directorio/directorio.component';
import { EstadoFichaComponent } from '../estado-ficha/estado-ficha.component';
import { UbicacionContactoComponent } from '../ubicacion-contacto/ubicacion-contacto.component';
import { DatosEmpresaComponent } from '../datos-empresa/datos-empresa.component';
import { AuthGuard } from '../../guards/auth.guard';
import { FichasreceptoresComponent } from '../fichasreceptores/fichasreceptores.component';
import { CertificadoComponent } from '../certificado/certificado.component';

const routes: Routes = [
  {
    path: '',
    component: ComponenteReceptoresComponentComponent,
    canActivate:      [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'misfichas', component: MisfichasComponent },
      { path: 'crear-ficha', component: CrearFichaComponent },
      { path: 'crear-fichaii', component: CrearFichaIIComponent },
      { path: 'crear-fichaiii', component: CrearFichaIIIComponent },
      { path: 'fichasaprobadas', component: FichasaprobadasComponent },
      { path: 'fichasrechazadas', component: FichasrechazadasComponent },
      { path: 'datosempresa', component: DatosEmpresaComponent },
      { path: 'ubicacioncontacto', component: UbicacionContactoComponent },
      { path: 'estadoFicha', component: EstadoFichaComponent },
      { path: 'directorioficha', component: DirectorioComponent },
      { path: 'fichasreceptores', component: FichasreceptoresComponent  },
      { path: 'certificado', component: CertificadoComponent  },

    ],
  }
];

@NgModule({
  
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponenteReceptoresRoutingModule {}

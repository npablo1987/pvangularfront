import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComponenteReceptoresRoutingModule } from './componente-receptores-routing.module';
import { ComponenteReceptoresComponentComponent } from '../componente-receptores-component/componente-receptores-component.component';
import { CabeceraLoggedComponent } from '../cabecera-logged/cabecera-logged.component';
import { PiePaginaComponent } from '../../components/pie-pagina/pie-pagina.component';
import { CrearFichaComponent } from '../crear-ficha/crear-ficha.component';
import { CrearFichaIIComponent } from '../crear-ficha-ii/crear-ficha-ii.component';
import { CrearFichaIIIComponent } from '../crear-ficha-iii/crear-ficha-iii.component';
import { FichasreceptoresComponent } from '../fichasreceptores/fichasreceptores.component';
import { CertificadoComponent } from '../certificado/certificado.component';

@NgModule({
  imports: [
    CommonModule,
    ComponenteReceptoresRoutingModule,
    CabeceraLoggedComponent,
    PiePaginaComponent,
    CrearFichaComponent,
    CrearFichaIIComponent,
    CrearFichaIIIComponent,
    FichasreceptoresComponent,
    CertificadoComponent,
    FormsModule
    
  ],
  declarations: [
    ComponenteReceptoresComponentComponent
  ],
})
export class ComponenteReceptoresModule {}

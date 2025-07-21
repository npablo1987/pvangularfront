import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PiePaginaComponent } from './components/pie-pagina/pie-pagina.component';
import { CabeceraNotLoggedInComponent } from './components/cabecera-not-logged-in/cabecera-not-logged-in.component';
import { TablaDataComponent } from './components/tabla-data/tabla-data.component';
import { SessionWarningComponent } from './components/session-warning/session-warning.component';
import { CargandoOverlayComponent } from './shared/cargando-overlay/cargando-overlay.component';
import { LoadingService } from './services/loading.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PiePaginaComponent, CabeceraNotLoggedInComponent,TablaDataComponent, SessionWarningComponent, CargandoOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RecepcionFondosPublicos';
  constructor(public loader: LoadingService) {}
}

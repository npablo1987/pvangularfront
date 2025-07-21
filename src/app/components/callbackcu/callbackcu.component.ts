import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaveunicaService } from '../../services/claveunica.service';

@Component({
  selector: 'app-callbackcu',
  template: `<p>Procesando login de Clave Única...</p>`
})
export class CallbackcuComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private claveUnicaService: ClaveunicaService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const state = params['state'];

      if (!code) {
        // Si no hay code, redirigir a home
        this.router.navigate(['/']);
        return;
      }

      this.procesarLogin(code, state);
    });
  }

  async procesarLogin(code: string, state: string) {
    try {
      // (Opcional) Validar que 'state' coincida con claveUnicaService.stateToken
      // if (state !== this.claveUnicaService.currentState) {
      //   throw new Error('State no coincide');
      // }

      // 1) Obtener token
      const tokenResponse = await this.claveUnicaService.exchangeCodeForToken(code);
      const accessToken = tokenResponse.access_token;

      // 2) Obtener datos
      const userInfo = await this.claveUnicaService.getUserInfo(accessToken);

      // 3) Guardar en sessionStorage, localStorage o en un servicio global
      sessionStorage.setItem('claveUnicaToken', accessToken);
      sessionStorage.setItem('claveUnicaUser', JSON.stringify(userInfo));

      // 4) Redirigir donde quieras (ej: a /misfichas)
      this.router.navigate(['/misfichas']);
    } catch (err) {
      console.error('Error al procesar login ClaveÚnica:', err);
      // redirige a algún error
      this.router.navigate(['/']);
    }
  }
}
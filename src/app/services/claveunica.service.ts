import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ClaveunicaService {

  private CLIENT_ID = environment.claveUnica.clientId;
  private CLIENT_SECRET = environment.claveUnica.clientSecret;
  private REDIRECT_URI = environment.claveUnica.redirectUri;

  private AUTH_URL = environment.claveUnica.authUrl;
  private TOKEN_URL = environment.claveUnica.tokenUrl;
  private USERINFO_URL = environment.claveUnica.userInfoUrl;
  private LOGOUT_URL = environment.claveUnica.logoutUrl;

  // Para el token anti-CSRF
  private stateToken = '';
  constructor() {}

  // Generar token "state" aleatorio
  private generateStateToken(): string {
    this.stateToken = Math.random().toString(36).substring(2);
    return this.stateToken;
  }

  /**
   * Paso 2: Redirigir al login de ClaveÚnica (igual que 'auth()' en PHP)
   */
  login(): void {
    const state = this.generateStateToken();
    const authUrl = `${this.AUTH_URL}?client_id=${this.CLIENT_ID}` +
      `&response_type=code` +
      `&scope=openid run name email` +
      `&redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}` +
      `&state=${state}`;

    window.location.href = authUrl;  // Redirige a ClaveÚnica
  }

  /**
   * Paso 4: Intercambiar el "code" por un "access_token" (similar a 'getAccessToken' en el PHP)
   */
  async exchangeCodeForToken(code: string): Promise<any> {
    const body = new URLSearchParams();
    body.set('client_id', this.CLIENT_ID);
    body.set('client_secret', this.CLIENT_SECRET);
    body.set('redirect_uri', this.REDIRECT_URI);
    body.set('grant_type', 'authorization_code');
    body.set('code', code);

    // Opcional: También podrías enviar 'state' para re-validarlo
    body.set('state', this.stateToken);

    const response = await fetch(this.TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });

    if (!response.ok) {
      throw new Error('Error en exchangeCodeForToken');
    }

    return response.json(); // { access_token, token_type, expires_in, id_token, ... }
  }

  /**
   * Paso 6: Obtener datos del usuario usando el "access_token" (similar a 'getCitizenInfo')
   */
  async getUserInfo(accessToken: string): Promise<any> {
    const response = await fetch(this.USERINFO_URL, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Error en getUserInfo');
    }

    return response.json(); 
    // Ej: { RolUnico: { numero: 12345678, DV:"9", tipo:"RUN"}, name:{ ... }, email: "...", ... }
  }

  /**
   * Paso 7: Cerrar sesión en ClaveÚnica
   */
  logout(): void {
    // Si quieres redirigir de vuelta a tu app después de cerrar ClaveÚnica:
    const logoutUrl = `${this.LOGOUT_URL}?redirect=${encodeURIComponent(this.REDIRECT_URI)}`;
    // Llamado explícito (Método 1 del manual):
    window.location.href = logoutUrl;
  }
}
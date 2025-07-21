import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, UrlTree  } from '@angular/router';
import { SesionService } from '../services/sesion.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private sesion: SesionService) {}

  private validar(): boolean | UrlTree {
    if (this.sesion.getUsuario()) {
      // Sesión válida ⇒ permite navegación
      return true;
    }
    // Sin sesión ⇒ limpia y redirige
    this.sesion.logout();                 // hace window.location.href = baseurlocal
    return false;                         // corta la navegación
  }

  canActivate()      { return this.validar(); }
  canActivateChild() { return this.validar(); }
}
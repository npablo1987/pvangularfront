/* ─ sesion.service.ts ───────────────────────────────── */
import { Injectable } from '@angular/core';
import { Subject, timer, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const KEY   = 'sesion_indap';
const MINUTOS_EXP = 10;
const AVISO_MS    = 30_000;        // 30 s para responder

@Injectable({ providedIn: 'root' })
export class SesionService {

  /** emite cuando faltan 30 s para expirar */
  aviso$ = new Subject<void>();

  private expTimerSub?: Subscription;      // → hasta el aviso
  private postAvisoSub?: Subscription;     // → cuenta atrás de 30 s

  constructor(private router: Router) {}

  /* ---------- público ---------- */

  setUsuario(data: any) {
    const payload = { data, exp: Date.now() + MINUTOS_EXP * 60_000 };
    localStorage.setItem(KEY, JSON.stringify(payload));
    this.programarAviso(payload.exp);
  }

  getUsuario() {
    const raw = localStorage.getItem(KEY);
    if (!raw) { return null; }
    const { data, exp } = JSON.parse(raw);
    if (Date.now() > exp) {
      this.logout();
      return null;
    }
    return data;
  }

  /** renueva 10 min desde ahora */
  renovar() {
    const u = this.getUsuario();
    if (u) {
      this.setUsuario(u);                  // re‑graba + re‑programa aviso
      this.postAvisoSub?.unsubscribe();    // ⬅️ cancela cuenta atrás previa
    }
  }


  logout() {
    this.expTimerSub?.unsubscribe();
    this.postAvisoSub?.unsubscribe();     
    localStorage.removeItem(KEY);
    window.location.href = environment.baseurlocal;
  }


  private programarAviso(expEpoch: number) {
    this.expTimerSub?.unsubscribe();
    this.postAvisoSub?.unsubscribe();      // ⬅️ limpia si existía

    const msHastaAviso = expEpoch - Date.now() - AVISO_MS;

    if (msHastaAviso <= 0) {               // ya casi expira
      this.lanzarAviso();
      return;
    }

    this.expTimerSub = timer(msHastaAviso).subscribe(() => this.lanzarAviso());
  }

  private lanzarAviso() {
    this.aviso$.next();

    // inicia la cuenta atrás de 30 s para cierre automático
    this.postAvisoSub = timer(AVISO_MS).subscribe(() => {
      if (this.getUsuario()) {             // si no se renovó…
        this.logout();
      }
    });
  }



}

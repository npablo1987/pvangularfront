import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  /** Señal reactiva; true = overlay visible */
  visible = signal(false);

  show()  { this.visible.set(true); }
  hide()  { this.visible.set(false); }
  constructor() { }
}

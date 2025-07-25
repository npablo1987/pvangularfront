import { Directive, HostListener, Input } from '@angular/core';

/**
 * Limita la cantidad de caracteres permitidos y filtra algunos caracteres especiales.
 */
@Directive({
  selector: '[appLimitarTexto]',
  standalone: true
})
export class LimitarTextoDirective {
  /** Máximo número de caracteres permitidos */
  @Input() appLimitarTexto = 200;

  /**
   * Expresión regular con los caracteres que NO estarán permitidos.
   * Por defecto se excluyen caracteres especiales comunes como < > { }.
   */
  @Input() appLimitarTextoExcluir: RegExp = /[<>\{\}]/g;

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    let valor = input.value;

    // Filtrar caracteres no permitidos
    if (this.appLimitarTextoExcluir) {
      valor = valor.replace(this.appLimitarTextoExcluir, '');
    }

    // Limitar longitud
    if (valor.length > this.appLimitarTexto) {
      valor = valor.slice(0, this.appLimitarTexto);
    }

    if (input.value !== valor) {
      input.value = valor;
      input.dispatchEvent(new Event('input'));
    }
  }
}

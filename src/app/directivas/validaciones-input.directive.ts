import { Directive, HostListener, ElementRef, Input } from '@angular/core';

/**
 * Directiva para permitir solo números en un input.
 * Uso: <input appValidacionesInput>
 */
@Directive({
  selector: '[appValidacionesInput]',
  standalone: true
})
export class ValidacionesInputDirective {
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    const limpio = input.value.replace(/\D/g, '');

    if (input.value !== limpio) {
      input.value = limpio;
      input.dispatchEvent(new Event('input')); // Para ngModel/reactive forms
    }
  }
}

@Directive({
  selector: '[appValidarRut]',
  standalone: true
})
export class ValidarRutDirective {

  private readonly MAX_CUERPO = 8;          // 8 dígitos máx. de cuerpo
  private readonly REGEX_NUM_K = /[^0-9K]/g;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  /* Escucha cada pulsación del usuario */
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    // 1) Limpia cualquier carácter no permitido
    let raw = input.value.toUpperCase().replace(this.REGEX_NUM_K, '');

    // 2) Limita largo  (8 de cuerpo + 1 de DV = 9)
    if (raw.length > this.MAX_CUERPO + 1) {
      raw = raw.slice(0, this.MAX_CUERPO + 1);
    }

    // 3) Si todavía no llega al DV, sólo muestra lo escrito
    if (raw.length < 2) {
      this.render(raw, null);
      return;
    }

    // 4) Separa cuerpo y DV
    const cuerpo = raw.slice(0, -1);
    const dv     = raw.slice(-1);

    // 5) Formatea cuerpo con puntos (grupos de 3 desde la derecha)
    const cuerpoPuntos = cuerpo
      .split('').reverse().join('')
      .replace(/(\d{3})(?=\d)/g, '$1.')
      .split('').reverse().join('');

    const rutFormateado = `${cuerpoPuntos}-${dv}`;
    const esValido      = this.validarRut(cuerpo, dv);

    this.render(rutFormateado, esValido);
  }

  /** Renderiza valor, dispara change y pinta clase de validación */
  private render(valor: string, valido: boolean | null) {
    const el = this.el.nativeElement;
    el.value = valor;
    el.dispatchEvent(new Event('input'));

    el.classList.remove('input-error', 'input-success');
    if (valido === true)  { el.classList.add('input-success'); }
    if (valido === false) { el.classList.add('input-error');   }
  }

  /** Algoritmo clásico Módulo 11 */
  private validarRut(cuerpo: string, dv: string): boolean {
    let suma = 0, mul = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i), 10) * mul;
      mul   = mul === 7 ? 2 : mul + 1;
    }
    const resto      = 11 - (suma % 11);
    const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
    return dv === dvEsperado;
  }
}

@Directive({
  selector: '[appValidarCorreo]',
  standalone: true,
})
export class ValidarCorreoDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value.trim();

    const valido = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(valor);

    this.setValidationClass(valido);
    this.updateModel(valor);
  }

  private updateModel(value: string) {
    this.el.nativeElement.value = value;
    this.el.nativeElement.dispatchEvent(new Event('input'));
  }

  private setValidationClass(valid: boolean) {
    const cl = this.el.nativeElement.classList;
    cl.remove('input-success', 'input-error');
    cl.add(valid ? 'input-success' : 'input-error');
  }
}


@Directive({
  selector: '[appValidarTelefono]',
  standalone: true,
})
export class ValidarTelefonoDirective {

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(): void {
    const input = this.el.nativeElement;

    let v = input.value.replace(/[^\d+]/g, '');
    if (!v.startsWith('+56')) {
      v = '+56' + v.replace(/^\+?56?/, '');
    }

    if (v.length > 12) v = v.slice(0, 12);
    if (input.value !== v) {
      input.value = v;
      input.dispatchEvent(new Event('input'));
    }
    const ok = /^\+569\d{8}$/.test(v);
    this.setClass(ok);
  }

  private setClass(valid: boolean) {
    const cl = this.el.nativeElement.classList;
    cl.remove('input-success', 'input-error');
    cl.add(valid ? 'input-success' : 'input-error');
  }
}
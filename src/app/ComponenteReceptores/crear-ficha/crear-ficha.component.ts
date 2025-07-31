import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FichaService } from '../../services/ficha.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidacionesInputDirective, ValidarRutDirective } from '../../directivas/validaciones-input.directive';
import { LimitarTextoDirective } from '../../directivas/limitar-texto.directive';

interface ArchivoWrapper {
  file?: File;   // presente cuando se acaba de seleccionar
  name: string;  // siempre presente para mostrar en la UI
}

interface OtroArchivo {
  key: string;
  label: string;
  nombre: string;
}
@Component({
  selector: 'app-crear-ficha',
  standalone: true,
  imports: [CommonModule, FormsModule,
    ValidacionesInputDirective,
    ValidarRutDirective,
    LimitarTextoDirective],
  templateUrl: './crear-ficha.component.html',
  styleUrls: ['./crear-ficha.component.css']
})
export class CrearFichaComponent implements OnInit{

  readonly MAX_FILE_SIZE = 20 * 1024 * 1024;  

  tipoEmpresa: string = ''; 
  noInformar: boolean = false;
  rutEmpresa: string = '';
  // Para vincular con ngModel en cada campo
  patrimonio: string = '';
  capitalSocial: string = '';
  estadoResultado: string = '';
  rut: string = ''; 
  razonSocial = '';
  personalidadJuridica = '';
  otorgadaPor = '';
  areaTematica = '';
  otroCounter = 0;
  archivosOtros: OtroArchivo[] = [];

  archivosRequeridosPorTipo: { [key: string]: Array<{ key: string; label: string }> } = {
    'municipalidad': [
      { key: 'fotocopiaRutMunicipio', label: 'Fotocopia Rut Municipio' },
      { key: 'decretoAsumoFunciones', label: 'Decreto de asumo de funciones' },
      { key: 'cedulaIdentidadAlcalde', label: 'Cédula de Identidad Alcalde' }
    ],
    'cooperativas': [
      { key: 'fotocopiaRutCooperativa', label: 'Fotocopia Rut Cooperativa' },
      { key: 'certificadoDaesMinecon', label: 'Certificado DAES Minecon' },
      { key: 'fotocopiaRutPresidente', label: 'Fotocopia Rut del Presidente' },
      { key: 'fotocopiaEstatutos', label: 'Fotocopia de Estatutos' }
    ],
    'comunidades-indigenas': [
      { key: 'fotocopiaRut', label: 'Fotocopia Rut' },
      { key: 'certificadoConadi', label: 'Certificado CONADI' },
      { key: 'certificadoConadiVigencia', label: 'Certificado CONADI de Vigencia del Directorio' },
      { key: 'cedulaIdentidadPresidente', label: 'Cédula de Identidad del Presidente' },
      { key: 'fotocopiaEstatutos', label: 'Fotocopia de Estatutos' }
    ],
    'organizaciones-comunitarias': [
      { key: 'fotocopiaRutorganizacion', label: 'Fotocopia Rut Organización' },
      { key: 'certificadorcvigenciadirectorio', label: 'Certificado Registro Civil de vigencia del Directorio' },
      { key: 'cedulaIdentidadPresidente', label: 'Cédula de Identidad del Presidente' },
      { key: 'fotocopiaEstatutos', label: 'Fotocopia de Estatutos' }
    ],
    'juntas-vigilancia-aguas': [
      { key: 'fotocopiaRutorganizacion', label: 'Fotocopia Rut Organización' },
      { key: 'certificadorcvigendirecciongeneralagua', label: 'Certificado de vigencia  Dirección General de Aguas' },
      { key: 'cedulaIdentidadPresidente', label: 'Cédula de Identidad del Presidente' },
      { key: 'fotocopiaEstatutos', label: 'Fotocopia de Estatutos' }
    ],
    'empresas-sociedades': [
      { key: 'fotocopiaRut', label: 'Fotocopia Rut' },
      { key: 'certificadocbienesraices', label: 'Certificado de vigencia  Conservador Bienes Raíces ' },
      { key: 'cedulaIdentidadrepResentante', label: 'Cédula de Identidad del Representante' },
      { key: 'fotocopiaEstatutos', label: 'Fotocopia de Estatutos' }
    ],
    'sindicado': [
      { key: 'fotocopiaRutOrganizacion', label: 'Fotocopia Rut Organización' },
      { key: 'certificadoDirecciónTrabajovigenciaDirectorio', label: 'Certificado Dirección del Trabajo de vigencia del Directorio' },
      { key: 'cedulaIdentidadPresidente', label: 'Cédula de Identidad del Presidente' },
      { key: 'fotocopiaEstatutos', label: 'Fotocopia de Estatutos' }
    ],
    'comunidades-agricolas': [
      { key: 'fotocopiaRut', label: 'Fotocopia Rut' },
      { key: 'certificadocbienesraices', label: 'Certificado de vigencia Bienes Nacionales' },      
      { key: 'cedulaIdentidadPresidente', label: 'Cédula de Identidad del Presidente' },
      { key: 'fotocopiaEstatutos', label: 'Fotocopia de Estatutos' }
    ]

  };



  // Estructura donde guardamos los archivos seleccionados
  archivosSeleccionados: { [key: string]: ArchivoWrapper | undefined } = {};

  // Manejo de certificado Registro 19862
  selectedFile: File | null = null;
  subiendo = false;
  mensaje = '';

  constructor(
    private router: Router,
    private fichaService: FichaService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    const ficha = this.fichaService.getFichaData();

    /* 1️⃣  Rellenar campos si existen --------------------------------- */
    if (ficha.datosEmpresa && Object.keys(ficha.datosEmpresa).length) {
      const d = ficha.datosEmpresa;
      this.rutEmpresa            = d.rutEmpresa;
      this.tipoEmpresa           = d.tipoEmpresa;
      this.razonSocial           = d.razonSocial;            
      this.personalidadJuridica  = d.personalidadJuridica;   
      this.otorgadaPor           = d.otorgadaPor;            
      this.areaTematica          = d.areaTematica;           
      this.patrimonio            = d.patrimonio;
      this.capitalSocial         = d.capitalSocial;
      this.estadoResultado       = d.estadoResultado;
      this.noInformar =
        d.patrimonio === '0' && d.capitalSocial === '0' && d.estadoResultado === '0';
    }

    /* 2️⃣  Restaurar “archivosSeleccionados” con nombres -------------- */
    this.archivosSeleccionados = {};
    Object.entries(ficha.archivos || {}).forEach(([key, a]: any) => {
      // a.name viene desde FichaService.persist()
      this.archivosSeleccionados[key] = { name: a.name };
    });
    console.table(this.archivosSeleccionados, ['name', 'file']);

    /* 3️⃣  Forzar recálculo de archivos requeridos */
    if (this.tipoEmpresa) {
      this.cambiarTipoEmpresa(this.tipoEmpresa, true);
    }
  }


  onRutInput(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    // 1. Solo dígitos o K/k
    let raw = input.value.toUpperCase().replace(/[^0-9K]/g, '');
  
    // 2. Máximo 9 caracteres (8 cuerpo + DV)
    if (raw.length > 9) {
      raw = raw.substring(0, 9);
    }
  
    // 3. Si aún no hay DV, solo actualizamos sin formatear con guion
    if (raw.length <= 1) {
      input.value = raw;
      this.rutEmpresa = raw;
      input.classList.remove('input-error', 'input-success');
      return;
    }
  
    // 4. Separar cuerpo y DV
    const cuerpo = raw.slice(0, -1);
    const dv     = raw.slice(-1);
  
    // 5. Insertar puntos cada 3 dígitos DESDE la derecha
    const cuerpoConPuntos = cuerpo
      .split('')
      .reverse()
      .join('')
      .replace(/(\d{3})(?=\d)/g, '$1.')
      .split('')
      .reverse()
      .join('');
  
    // 6. Unir con guion
    const formateado = `${cuerpoConPuntos}-${dv}`;
  
    // 7. Refrescar valor del input y del modelo
    input.value    = formateado;
    this.rutEmpresa = formateado;
  
    // 8. Validar DV y pintar borde
    const esValido = this.parsearRutCompleto(formateado) !== null;
    input.classList.toggle('input-error',  !esValido);
    input.classList.toggle('input-success', esValido);
  }
  
  onRutChange(value: string) {
    // 1. Limpiar y formatear
    let limpio = value.replace(/[^0-9kK]/g, '').toUpperCase();
  
    if (limpio.length > 1) {
      const cuerpo = limpio.slice(0, -1);
      const dv = limpio.slice(-1);
      let cuerpoReves = cuerpo.split('').reverse().join('');
      let cuerpoFormateadoReves = cuerpoReves.replace(/(\d{3})(?=\d)/g, '$1.');
      let cuerpoFormateado = cuerpoFormateadoReves.split('').reverse().join('');
      limpio = cuerpoFormateado + '-' + dv;
    }
  
    this.rut = limpio;
  
    // 2. Validar formato y DV
    const campoRut = document.getElementById('rutEmpresa');
    const esValido = this.parsearRutCompleto(this.rut) !== null;
  
    if (campoRut) {
      if (esValido) {
        campoRut.classList.remove('input-error');
        campoRut.classList.add('input-success');
      } else {
        campoRut.classList.add('input-error');
        campoRut.classList.remove('input-success');
      }
    }
  }

 
  private parsearRutCompleto(rutFormateado: string): string | null {
    const regex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    if (!regex.test(rutFormateado)) {
      return null;
    }
    // quitar puntos/guion
    const limpio = rutFormateado.replace(/\./g, '').replace('-', '');
    // cuerpo sin dv
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    // Validar DV
    if (!this.validarDV(cuerpo, dv.toUpperCase())) {
      return null;
    }
    return cuerpo;  // ej: "16650344"
  }

  /**
   * Lógica de dígito verificador 
   */
  private validarDV(cuerpo: string, dv: string): boolean {
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i], 10) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    const resto = 11 - (suma % 11);
    let dvEsperado;
    if (resto === 11) {
      dvEsperado = '0';
    } else if (resto === 10) {
      dvEsperado = 'K';
    } else {
      dvEsperado = String(resto);
    }
    return dv === dvEsperado;
  }



  validarFormulario(): boolean {
    let esValido = true;
    let mensajeError = '';
  
    const camposRequeridos = [
      'rutEmpresa',
      'razonSocial',
      'personalidadJuridica',
      'otorgadaPor',
      'areaTematica',
      'tipoEmpresa'                     
    ];
  
    if (!this.noInformar) {
      camposRequeridos.push('patrimonio', 'capitalSocial', 'estadoResultado');
    }
  
    camposRequeridos.forEach(id => {
      const campo = document.getElementById(id) as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement;
  
      if (!campo || campo.value.trim() === '') {
        campo?.classList.add('input-error');
        const etiqueta = campo?.labels?.[0]?.innerText || id;
        mensajeError += `- ${etiqueta} está vacío.\n`;
        esValido = false;
      } else {
        campo.classList.remove('input-error');
      }
    });
  
    /* 2. Archivos requeridos según tipo de empresa -------------------- */
    if (this.tipoEmpresa && this.archivosRequeridosPorTipo[this.tipoEmpresa]) {
      this.archivosRequeridosPorTipo[this.tipoEmpresa].forEach(({ key, label }) => {
        const file = this.archivosSeleccionados[key];
        const inputFile = document.getElementById(key) as HTMLInputElement;
  
        if (!file) {                       // null o undefined
          inputFile?.classList.add('input-error-file');
          mensajeError += `- Falta subir ${label}.\n`;
          esValido = false;
        } else {
          inputFile?.classList.remove('input-error-file');
        }
      });
    } else {
      // Si aún no han elegido tipo de empresa, ya lo marcamos arriba
    }

    /* 2b. Validar nombres personalizados de los archivos "otro" -------- */
    Object.entries(this.archivosSeleccionados)
      .filter(([k]) => k.startsWith('otro'))
      .forEach(([k]) => {
        const otro = this.archivosOtros.find(o => o.key === k);
        const nombre = otro?.nombre?.trim() || '';
        const inputNombre = document.getElementById(k + '_nombre') as HTMLInputElement;

        if (!nombre) {
          inputNombre?.classList.add('input-error');
          mensajeError += `- Debe indicar un nombre para ${otro?.label}.\n`;
          esValido = false;
        } else if (nombre.length > 100) {
          inputNombre?.classList.add('input-error');
          mensajeError += `- El nombre para ${otro?.label} supera 100 caracteres.\n`;
          esValido = false;
        } else {
          inputNombre?.classList.remove('input-error');
        }
      });
  
    /* 3. Mostrar mensaje final ---------------------------------------- */
    if (!esValido) {
      alert(`Debe completar los siguientes campos antes de continuar:\n${mensajeError}`);
    }
    return esValido;
  }
  

  guardarDatosEmpresa() {
    this.fichaService.setDatosEmpresa({
      rutEmpresa:           this.rutEmpresa,
      razonSocial:          this.razonSocial,
      tipoEmpresa:          this.tipoEmpresa,
      personalidadJuridica: this.personalidadJuridica,
      otorgadaPor:          this.otorgadaPor,
      areaTematica:         this.areaTematica,
      patrimonio:           this.noInformar ? '0' : this.patrimonio,
      capitalSocial:        this.noInformar ? '0' : this.capitalSocial,
      estadoResultado:      this.noInformar ? '0' : this.estadoResultado
    });
  }

  cambiarTipoEmpresa(nuevoTipo: string, preserve = false) {
    console.log('→ cambiarTipoEmpresa', { nuevoTipo, preserve });
  
    this.tipoEmpresa = nuevoTipo;
  
    // ⚠️  Solo vacía si el usuario selecciona manualmente
    if (!preserve) {
      this.archivosSeleccionados = {};
    }
  }

  abrirInput(id: string) {
    console.log(`Clic en botón para seleccionar archivo: ${id}`);
    document.getElementById(id)?.click();
  }

  onFileSelected(event: Event, keyArchivo: string) {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    if (!file) return;
  
    if (file.size > this.MAX_FILE_SIZE) {
      alert(
        `El archivo supera 20 MB (${(file.size / 1024 / 1024).toFixed(2)} MB)`
      );
      inputEl.value = '';
      return;
    }
  
    this.archivosSeleccionados[keyArchivo] = {
      file,
      name: file.name
    };
    this.cdr.detectChanges();
  }

  quitarArchivo(keyArchivo: string) {
    delete this.archivosSeleccionados[keyArchivo];   // quita wrapper
  
    const inputEl = document.getElementById(keyArchivo) as HTMLInputElement;
    if (inputEl) inputEl.value = '';
  }
  /**
   * Aquí aprovechamos de asociar la 'categoría' (label) al archivo
   * de modo que FichaService sepa cuál es el tipo de documento.
   */
  guardarArchivos() {
    Object
      .entries(this.archivosSeleccionados)  // -> Array<[string, ArchivoWrapper | undefined]>
      .forEach(([key, wrapper]) => {
        if (!wrapper) return;               // filtramos los undefined
        if (wrapper.file) {
          const requerido = this.archivosRequeridosPorTipo[this.tipoEmpresa]
            ?.find(a => a.key === key)?.label;
          const otroNombre = this.archivosOtros.find(o => o.key === key)?.nombre;
          const label = requerido || otroNombre || 'SinEtiqueta';

          console.log(`→ Persistiendo ${wrapper.name} como ${label}`);
          this.fichaService.setArchivos(key, wrapper.file, label);
        }
      });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.mensaje = '';
    }
  }

  subirCertificado() {
    if (!this.selectedFile || this.subiendo) { return; }

    this.subiendo = true;
    try {
      this.fichaService.setArchivos(
        'certificadoRegistro19862',
        this.selectedFile,
        'Certificado Registro 19862'
      );
      this.mensaje = '✅ Certificado cargado correctamente';
      this.selectedFile = null;
      const inputEl = document.getElementById('certificado') as HTMLInputElement | null;
      if (inputEl) { inputEl.value = ''; }
    } catch (err) {
      console.error(err);
      this.mensaje = '❌ Error al cargar el certificado';
    } finally {
      this.subiendo = false;
    }
  }

  irCrearFichaparteii() {
    if (this.validarFormulario()) {
      this.guardarDatosEmpresa();
      this.guardarArchivos();
      this.router.navigate(['/receptores/crear-fichaii']);
      console.log('Redirigiendo a Crear Ficha parte II...');
    }
  }

   
  agregarOtroArchivo(): void {
    const nextIndex = this.archivosOtros.length + 1;          // 1-based
    const key       = `otro${nextIndex}`;

    this.archivosOtros.push({
      key,
      label: `Otro archivo #${nextIndex}`,
      nombre: ''
    });
  
    this.cdr.detectChanges();      // refresco si usas OnPush
  }
  

  /** Elimina por completo el slot “otroX” (fila + archivo seleccionado) */
  eliminarOtroSlot(keyEliminado: string): void {
    // a) Quitar el slot de la lista visual
    this.archivosOtros = this.archivosOtros.filter(o => o.key !== keyEliminado);

    // b) Reconstruir lista + selección para que queden ordenados
    const nuevosOtros: OtroArchivo[] = [];
    const nuevosSeleccionados: { [k: string]: ArchivoWrapper } = {};

    this.archivosOtros.forEach((o, idx) => {
      const newKey = `otro${idx + 1}`;            // 1,2,3…
      const newLabel = `Otro archivo #${idx + 1}`;
      nuevosOtros.push({ key: newKey, label: newLabel, nombre: o.nombre });

      // salvamos el wrapper en una variable
      const wrapper = this.archivosSeleccionados[o.key];
      if (wrapper) {
        // wrapper es ArchivoWrapper, no hay undefined
        nuevosSeleccionados[newKey] = wrapper;
      }
    });
  
    this.archivosOtros = nuevosOtros;
    this.archivosSeleccionados = nuevosSeleccionados;
  
    // c) Limpieza del input nativo (por si quedó en el DOM)
    const inputEl = document.getElementById(keyEliminado) as HTMLInputElement | null;
    if (inputEl) inputEl.value = '';
  
    this.cdr.detectChanges();
  }
  
}

// src/app/services/ficha.service.ts
import { Injectable } from '@angular/core';
import { Socio } from '../models/socio.model';

/* ─────────────────────────────────────────────────────────── */
/*  Interfaces y constantes                                    */
/* ─────────────────────────────────────────────────────────── */
export interface ArchivoConCategoria {
  file: File | null;    // ← nunca undefined
  name: string;
  label: string;
}

interface ArchivoWrapper {
  file?: File;   // cuando se acaba de seleccionar
  name: string;  // siempre presente para mostrar el nombre
}

interface FichaData {
  datosEmpresa: any;
  ubicacionContacto: any;
  archivos: { [key: string]: ArchivoConCategoria };
  listaSocios: Socio[];
}

const STORAGE_KEY = 'fichaRFP';          // Clave en sessionStorage
const TTL_MS      = 10 * 60 * 1_000;     // 10 minutos

/* ─────────────────────────────────────────────────────────── */
/*  Servicio                                                  */
/* ─────────────────────────────────────────────────────────── */
@Injectable({ providedIn: 'root' })
export class FichaService {

  archivosSeleccionados: { [key: string]: ArchivoWrapper } = {};
  
  private fichaData: FichaData = {
    datosEmpresa:      {},
    ubicacionContacto: {},
    archivos:          {},
    listaSocios:       []
  };

  constructor() {
    this.restore();                     // ← Intenta cargar desde sessionStorage
  }

  /* ==========================================================
   * 1) Datos de la Empresa (Paso I)
   * ======================================================== */
  setDatosEmpresa(datos: any): void {
    this.fichaData.datosEmpresa = datos;
    this.persist();
  }
  getDatosEmpresa() { return this.fichaData.datosEmpresa; }

  /* ==========================================================
   * 2) Ubicación y contacto (Paso II)
   * ======================================================== */
  setUbicacionContacto(datos: any): void {
    this.fichaData.ubicacionContacto = datos;
    this.persist();
  }
  getUbicacionContacto() { return this.fichaData.ubicacionContacto; }

  /* ==========================================================
   * 3) Archivos (clave → { file, label })
   * ======================================================== */
  setArchivos(key: string, archivo: File, label: string) {
    this.fichaData.archivos[key] = {
      file: archivo,          // File real
      name: archivo.name,
      label
    };
    this.persist();
  }
  
  getArchivos() { return this.fichaData.archivos; }

  /* ==========================================================
   * 4) Manejo de la lista de socios (Paso III)
   * ======================================================== */
  getListaSocios(): Socio[] { return this.fichaData.listaSocios; }

  agregarSocio(nuevo: Socio): void {
    if (this.fichaData.listaSocios.some(s => s.rut === nuevo.rut)) {
      console.warn(`El socio con RUT ${nuevo.rut} ya está registrado.`);
      return;
    }
    this.fichaData.listaSocios.push(nuevo);

    if (nuevo.archivoCedula) {
      this.setArchivos(`cedula_${nuevo.rut}`, nuevo.archivoCedula, 'Cédula Socio');
    }
    this.persist();
  }

  editarSocio(index: number, socioEditado: Socio): void {
    this.fichaData.listaSocios[index] = socioEditado;

    if (socioEditado.archivoCedula) {
      this.setArchivos(`cedula_${socioEditado.rut}`, socioEditado.archivoCedula, 'Cédula Socio Editado');
    }
    this.persist();
  }

  eliminarSocio(index: number): void {
    const socio = this.fichaData.listaSocios[index];
    this.fichaData.listaSocios.splice(index, 1);

    if (socio?.rut) delete this.fichaData.archivos[`cedula_${socio.rut}`];
    this.persist();
  }

  /* ==========================================================
   * 5) Acceso y limpieza global
   * ======================================================== */
  getFichaData(): FichaData { return this.fichaData; }

  clearFichaData(): void {
    this.fichaData = { datosEmpresa: {}, ubicacionContacto: {}, archivos: {}, listaSocios: [] };
    sessionStorage.removeItem(STORAGE_KEY);
  }

  /* ==========================================================
   * Persistencia en sessionStorage con TTL de 10 min
   * ======================================================== */
  private persist(): void {
    const safeData = structuredClone(this.fichaData);
    Object.values(safeData.archivos).forEach(a => delete (a as any).file);
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ts: Date.now(), data: safeData })
    );
  }
  
  private restore(): void {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts < TTL_MS) {
        this.fichaData = data as FichaData;         // Dentro del plazo → restaurar
      } else {
        sessionStorage.removeItem(STORAGE_KEY);     // Expiró → limpiar
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);       // Corrupción → limpiar
    }
  }
}

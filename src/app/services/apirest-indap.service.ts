import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin  } from 'rxjs';
import { PersonaJuridica } from '../models/persona-juridica';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
// Interfaz opcional para manejar archivos con label en tu servicio
interface ArchivoConCategoria {
  file: File| null;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApirestIndapService {

  private baseUrl = environment.baseurl;
  readonly apiRoot = environment.baseurl.replace(/\/$/, '');
  private pjuridica = `${this.baseUrl}persona-juridica/`;
  private apiUrlLocation = `${this.baseUrl}location/`;
  private apiUrlAgricultor = `${this.baseUrl}agricultor/`;
  private pjuridicaEndpoint = 'persona-juridica/create';
  private uploadEndpoint = 'documento/upload';
  private createWithFilesEndpoint = 'persona-juridica/create-with-files';

  constructor(private http: HttpClient) {}

  downloadCertificadoRFP(idFicha: number) {
    const url = `${this.apiRoot}/persona-juridica/certificado-rfp/${idFicha}?download=1`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getCertificadoRFPmeta(idFicha: number) {
    const url = `${this.baseUrl.replace(/\/$/, '')}/persona-juridica/certificado-rfp/${idFicha}`;
    return this.http.get<any>(url);
  }

  uploadRegistro1986(idFicha: number, file: File) {
    const formData = new FormData();
    formData.append('archivo', file);        // mismo nombre que usa el endpoint
  
    const url = `${this.baseUrl}persona-juridica/registro1986/${idFicha}`;
    return this.http.post<any>(url, formData);
  }

  dataFichaCompleta(id_ficha: number): Observable<any> {
    // Aquí llamamos al endpoint /ficha/completa/{id_ficha}
    return this.http.get<any>(`${this.pjuridica}completa/${id_ficha}`);
  }

  obtenerFichasPorusuarioyestado(id_usuario: string, estado: string): Observable<any> {
    const url = `${this.pjuridica}persona-juridica-por-idusuario-estado/${id_usuario}/estado/${estado}`;
    return this.http.get<any>(url);
  }

  obtenerFichasPorusuario(id_usuario: string): Observable<any> {
    const url = `${this.pjuridica}persona-juridica-por-idusuario/${id_usuario}`;
    return this.http.get<any>(url);
  }


  obtenerFichasPorRut(rut: string): Observable<any> {
    const url = `${this.pjuridica}fichas-por-rut/${rut}`;
    return this.http.get<any>(url);
  }

  obtenerFichasPorRutYEstado(rut: string, estado: string): Observable<any> {
    const url = `${this.pjuridica}fichas-por-rut-y-estado/${rut}/${estado}`;
    return this.http.get<any>(url);
  }

  iniciarSesionCedula(rut: string, fechaNacimiento: string, credentialNumber: string): Observable<any> {
    const payload = {
      rut,
      fechaNacimiento,
      credentialNumber
    };

    return this.http.post<any>(
      `${this.baseUrl}registro-civil/sesionuserCedula`,
      payload
    );
  }

  consultarRutPisee(rut: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}registro-civil/consulta-rut/${rut}`);
  }

  verificarCedula(run: string, credentialNumber: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}registro-civil/consulta_documento_cow?RUN=${run}&credentialNumber=${credentialNumber}`,
      {}
    );
  }
  
  obtenerPersonasJuridicas(
    skip: number = 0,
    limit: number = 100
  ): Observable<PersonaJuridica[]> {
    return this.http.get<PersonaJuridica[]>(
      `${this.pjuridica}?skip=${skip}&limit=${limit}`
    );
  }

  obtenerRegiones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlLocation}regions`);
  }

  obtenerComunasPorRegion(regionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlLocation}regions/${regionId}/comunas`);
  }

  obtenerAgricultor(rut: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlAgricultor}?rut=${rut}`);
  }

  enviarPersonaJuridica(fichaData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.pjuridicaEndpoint}`, fichaData);
  }

  crearPersonaJuridicaConArchivos(
    pjData: any,
    archivos: { [key: string]: ArchivoConCategoria }
  ): Observable<any> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(pjData));
  
    // 1) Loguear el payload y las llaves de archivos
    console.log('[Service] ▶ crearPersonaJuridicaConArchivos: pjData =', pjData);
    console.log('[Service] ▶ crearPersonaJuridicaConArchivos: archivos keys =', Object.keys(archivos));
  
    // 2) Categorías
    const categorias: { fileKey: string; label: string }[] = [];
    for (const key in archivos) {
      if (archivos.hasOwnProperty(key)) {
        console.log(`[Service]   • archivo “${key}”: label=”${archivos[key].label}”`, archivos[key].file);
        categorias.push({ fileKey: key, label: archivos[key].label });
      }
    }
    formData.append('categorias', JSON.stringify(categorias));
  
    // 3) Archivos binarios
    for (const key in archivos) {
      const a = archivos[key];
      if (a.file instanceof File) {
        console.log(`[Service]   → adjuntando File: key=“${key}”, name=“${a.file.name}”`);
        formData.append('files', a.file, key);
      } else {
        console.warn(`[Service]   ⚠️ no hay File en archivos[“${key}”]`);
      }
    }
    return this.http.post<any>(
      this.baseUrl + this.createWithFilesEndpoint,
      formData
    ).pipe(
      tap({
        next: res => console.log('[Service] ✅ create-with-files response', res),
        error: err => console.error('[Service] ❌ create-with-files error', err)
      })
    );
}
  

  subirArchivos(
    id_ficha: number,
    rutReceptor: string,
    archivos: { [key: string]: File }
  ): Observable<any[]> {
    const peticiones: Observable<any>[] = [];
    for (const key in archivos) {
      if (archivos.hasOwnProperty(key)) {
        const formData = new FormData();
        formData.append('file', archivos[key]);
        formData.append('file_key', key);
        formData.append('rut_receptor', rutReceptor);
        formData.append('id_ficha', id_ficha.toString());

        const url = `${this.baseUrl}${this.uploadEndpoint}`;
        peticiones.push(this.http.post(url, formData));
      }
    }
    return forkJoin(peticiones);
  }
}

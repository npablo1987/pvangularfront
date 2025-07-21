export interface Socio {
  rut: string;
  nombre: string;
  sexo: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  correo?: string; 
  cargo: string[];
  representanteLegal: boolean;
  archivoCedula: File | null;
}

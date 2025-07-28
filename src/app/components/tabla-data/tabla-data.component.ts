import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApirestIndapService } from '../../services/apirest-indap.service';
import { PersonaJuridica } from '../../models/persona-juridica';
import { CabeceraNotLoggedInComponent } from '../cabecera-not-logged-in/cabecera-not-logged-in.component';
import { PiePaginaComponent } from '../pie-pagina/pie-pagina.component';
declare var $: any;

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-tabla-data',
  standalone: true,
  imports: [CommonModule, CabeceraNotLoggedInComponent, PiePaginaComponent],
  templateUrl: './tabla-data.component.html',
  styleUrls: ['./tabla-data.component.css']
})
export class TablaDataComponent implements OnInit {
  personas: PersonaJuridica[] = [];
  dataTableInitialized = false;
  dataTable: any;
  sortDirection: Record<'region' | 'fecha', 'asc' | 'desc'> = {
    region: 'asc',
    fecha: 'asc'
  };

  constructor(private apiService: ApirestIndapService) {}

  ngOnInit(): void {
    this.apiService.obtenerPersonasJuridicas().subscribe({
      next: (data) => {
        console.log("✅ Datos recibidos desde la API:", data);
        this.personas = data;
  
        // Asegurar que DataTable se reinicie correctamente
        setTimeout(() => this.initializeDataTable(), 0);
      },
      error: (err) => console.error("❌ Error al cargar datos:", err)
    });
  }
  
  exportarAExcel(): void {
    const tabla = document.getElementById('fichasReceptores');
    if (!tabla) return;

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tabla);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Receptores');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, 'receptores_fondos.xlsx');
  }



  initializeDataTable(): void {
    setTimeout(() => {
      if (this.dataTableInitialized) {
        $('#fichasReceptores').DataTable().destroy(); // Destruir antes de reiniciar
      }

      this.dataTable = $('#fichasReceptores').DataTable({
        searching: true,
        paging: true,
        responsive: true,
        language: {
          emptyTable: "No hay información",
          info: "Mostrando _START_ a _END_ de _TOTAL_ ",
          infoEmpty: "Mostrando 0 a 0 de 0 entradas",
          lengthMenu: "Mostrar _MENU_ entradas",
          search: "Buscar:",
          zeroRecords: "No se encontraron coincidencias",
          paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
          }
        }
      });

      this.dataTableInitialized = true;
    }, 0);
  }

  toggleSort(column: 'region' | 'fecha'): void {
    if (!this.dataTable) {
      return;
    }
    const index = column === 'region' ? 2 : 6;
    const direction = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    this.sortDirection[column] = direction;
    this.dataTable.order([index, direction]).draw();
  }
}

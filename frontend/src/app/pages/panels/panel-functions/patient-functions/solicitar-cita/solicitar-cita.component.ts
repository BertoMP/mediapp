import { Component, OnInit } from '@angular/core';
import { EspecialidadService } from '../../../../../core/services/especialidad.service';
import { Select2Data, Select2Module } from 'ng-select2-component';
import { EspecialidadModel } from '../../../../../core/interfaces/especialidad.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MedicalSpecialistListService } from '../../../../../core/services/medical-specialist-list.service';
import { EspecialistaCitaModel } from '../../../../../core/interfaces/especialista-cita.model';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { CitasService } from '../../../../../core/services/citas.service';
import { CitasDisponiblesModel } from '../../../../../core/interfaces/citas-disponibles.model';
import { Observable, Subject, debounceTime } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from '../../../../../core/services/auth.service';
import { AgendaDataModel } from '../../../../../core/interfaces/agenda-data.model';
import { EspecialistModel } from '../../../../../core/interfaces/especialist.model';
import { DateFormatPipe } from '../../../../../shared/pipes/date-format.pipe';
import Swal from 'sweetalert2';
import { CitaUploadModel } from '../../../../../core/interfaces/cita-upload.model';

@Component({
  selector: 'app-solicitar-cita',
  standalone: true,
  imports: [NgxPaginationModule,
    NgFor,
    NgForOf,
    NgIf,
    FormsModule,
    RouterLink,
    LoadingSpinnerComponent,
    Select2Module,DateFormatPipe],
  templateUrl: './solicitar-cita.component.html',
  styleUrl: './solicitar-cita.component.scss'
})
export class SolicitarCitaComponent implements OnInit {
  especialidades: Select2Data;
  especialistas: Select2Data;

  especialidad_id: number;
  especialista_id: number;
  especialista: EspecialistModel;
  paciente_nombre: string;
  paciente_id:number;
  fecha: string;

  citaBuscada = false;

  cantidad_citas: number;
  citas_disponibles: string[];
  citas: AgendaDataModel;
  fecha_cita: string;
  itemsPerPage: number;
  nextPageUrl: string;
  actualPage: number;
  totalPages: number;
  previousPageUrl: string;
  resultMax: number;
  resultMin: number;
  totalItems: number;

  errores: string[];

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  private getCitasSubject: Subject<void> = new Subject<void>();

  constructor(private router: Router,private authService: AuthService, private especialidadService: EspecialidadService, private medicalEspecialistService: MedicalSpecialistListService, private citasService: CitasService) { }

  buscarEspecialidades() {
    this.especialidadService.getEspecialidad()
      .subscribe({
        next: (especialidad: EspecialidadModel[]) => {
          this.especialidades = especialidad.map((especialidad: EspecialidadModel) => {
            return {
              value: especialidad.id,
              label: especialidad.nombre
            }
          });

          console.log(this.especialidades);

        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching especialidades', error.error);
        }
      })
  }

  getPacienteNombreId() {
    this.paciente_nombre = this.authService.getUserName();
    this.paciente_id=this.authService.getUserId();
  }

  buscarEspecialistas() {
    if (this.especialidad_id != undefined) {
      this.medicalEspecialistService.getSpecialist(this.especialidad_id)
        .subscribe({
          next: (especialistas: EspecialistaCitaModel[]) => {
            console.log(especialistas);

            this.especialistas = especialistas.map((especialista: EspecialistaCitaModel) => {
              return {
                value: especialista.id,
                label: especialista.usuario_nombre
              }
            });

            console.log(this.especialistas);
          },
          error: (error: HttpErrorResponse) => {
            this.citas_disponibles=[];
            this.especialistas = null;
            this.especialista_id=null;
            console.error('Error fetching especialistas', error.error);
          }
        })
    }

  }
  buscarCitas() {
    if (this.especialista_id != null && this.fecha != null) {
      this.citasService.getCitaDisponible(this.especialista_id, this.fecha).subscribe({
        next: (citas: CitasDisponiblesModel) => {
          this.#showResults(citas);
          this.buscarEspecialista();
          this.citaBuscada = true;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching citas', error.error);
        }
      })
    } else {
      this.imprimirMensaje();
    }
  }

  imprimirMensaje(){
    Swal.fire({
      title: 'Elige una fecha y un especialista',
      text: `Elige una fecha y un especialista para poder buscar citas disponibles`,
      icon: 'info',
      width: '50%'
    })
      .then(() => {
        Swal.close();
      })
  }

  buscarEspecialista() {

    this.authService.getEspecialista(this.especialista_id).subscribe({
      next: (especialista: EspecialistModel) => {
        this.especialista = especialista;
        console.log(this.especialista);
        this.dataLoaded = true;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching Especialista', error.error);
      }
    })
  }


  updateFilters(): void {
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = 1;
      this.getCitasSubject.next();
    }
  }

  changePage(page: number) {
    console.log(page);
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = page;
      this.getCitasSubject.next();
    }
  }

  #showResults(data) {
    console.log(data);
    this.nextPageUrl = data.next;
    this.previousPageUrl = data.prev;
    this.totalPages = data.paginas_totales;
    this.resultMin = data.result_min;
    this.resultMax = data.result_max;
    this.totalItems = data.cantidad_citas;
    this.itemsPerPage = data.items_pagina;
    this.actualPage = data.pagina_actual;
    this.citas = data.datos_agenda;
    this.citas_disponibles = this.citas.citas_disponibles;
    console.log(this.citas.fecha_cita);

  }

  pedirCita(hora:string) {
    let citaSolicitada:CitaUploadModel={
      paciente_id:this.paciente_id,
      especialista_id:this.especialista_id,
      fecha:this.fecha,
      hora:hora
    }

    let request = this.citasService.confirmarCita(citaSolicitada);

    request.subscribe({
      next: (response: CitaUploadModel) => {
        Swal.fire({
          title: 'Enhorabuena',
          text: 'Has conseguido solicitar la cita correctamente',
          icon: 'success',
          width: '50%'
        }).then(() => {
          this.router.navigate(['/mediapp/listado-citas'])
        })
      },
      error: (error: string[]) => {
        this.errores = error;
      },
    });
  }

  confirmarCita(hora:string) {
    Swal.fire({
      text: '¿Estás seguro que quieres acudir a esta cita?',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      icon: 'question',

      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedirCita(hora);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Usuario canceló la solicitud");
      }
    })
  }

  ngOnInit(): void {
    this.actualPage = 1;
    this.citas_disponibles = [];
    this.errores = [];

    this.getPacienteNombreId();
    this.buscarEspecialidades();

    this.initialLoad = true;
    this.getCitasSubject.next();
  }
}

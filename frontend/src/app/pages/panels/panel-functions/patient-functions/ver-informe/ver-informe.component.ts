import { Component } from '@angular/core';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';
import { CitasService } from '../../../../../core/services/citas.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatosPacienteModel } from '../../../../../core/interfaces/datos-paciente.model';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { InformeSpecificData } from '../../../../../core/interfaces/informe-specific-data.model';
import { Location, NgFor } from '@angular/common';
import { InformeService } from '../../../../../core/services/informe.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-ver-informe',
  standalone: true,
  imports: [LoadingSpinnerComponent, RouterLink, NgFor],
  templateUrl: './ver-informe.component.html',
  styleUrl: './ver-informe.component.scss'
})
export class VerInformeComponent {
  informe: InformeSpecificData;
  persona: DatosPacienteModel;

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  isUserLoggedIn: boolean = false;
  userId: number;
  suscripcionRuta: Subscription;
  id: number;
  private getMedsSubject: Subject<void> = new Subject<void>();

  constructor(private informeService: InformeService, private citasService: CitasService, private activatedRoute: ActivatedRoute, private location: Location) { }


  errores: string[];

  ngOnInit(): void {
    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;

      this.getMedsSubject
        .pipe(
          debounceTime(500)
        )
        .subscribe({
          next: () => {
            this.getInforme(this.id);
          },
          error: (error: string[]) => {
            this.errores = error;
          }
        });
      this.initialLoad = true;
      this.getMedsSubject.next();
    });
  }

  volver() {
    this.location.back();
  }

  getInforme(id: number) {
    let request: Observable<InformeSpecificData> = this.informeService.getInforme(id);

    request.subscribe({
      next: (response: InformeSpecificData) => {
        console.log(response);
        this.dataLoaded = true;
        this.informe = response;
      },
      error: (error: string[]) => {
        console.log(error);
        this.errores = error;
      },
    });
  }

  descargarInforme() {
    this.informeService.getDownloadInforme(this.informe.datos_informe.id).subscribe((response: any) => {
      const blob = new Blob([response]);
      saveAs(blob, `cita_${this.informe.datos_paciente.datos_personales.nombre}_${this.informe.datos_paciente.datos_personales.primer_apellido}_${this.informe.datos_paciente.datos_personales.segundo_apellido}.pdf`);
    });
  }
}
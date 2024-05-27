import { LowerCasePipe, NgForOf, NgIf, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Select2Module, Select2Data } from 'ng-select2-component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subject, debounceTime, Observable } from 'rxjs';
import { LoadingSpinnerComponent } from '../../../../../../shared/components/loading-spinner/loading-spinner.component';
import { VerticalCardComponent } from '../../../../../../shared/components/vertical-card/vertical-card.component';
import { RemoveAccentsPipe } from '../../../../../../shared/pipes/remove-accents.pipe';
import { RemoveBrPipe } from '../../../../../../shared/pipes/remove-br.pipe';
import { PatologiasDataModel } from '../../../../../../core/interfaces/patologias-data.model';
import { PatologiasService } from '../../../../../../core/services/patologias.service';
import { PatologiasListModel } from '../../../../../../core/interfaces/patologias-list.model';

@Component({
  selector: 'app-listado-patologias',
  standalone: true,
  imports: [VerticalCardComponent,
    LowerCasePipe,
    RemoveAccentsPipe,
    LoadingSpinnerComponent,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    FormsModule,
    RouterLink,
    RouterOutlet,
    ReactiveFormsModule,
    Select2Module,
    UpperCasePipe,
    RemoveBrPipe],
  templateUrl: './listado-patologias.component.html',
  styleUrl: './listado-patologias.component.scss'
})
export class ListadoPatologiasComponent {
  patologias: PatologiasDataModel[];
  nextPageUrl: string;
  previousPageUrl: string;
  actualPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  errores: string[];
  search: string = "";
  perPage: string = "10";
  resultMin: number;
  resultMax: number;

  dataLoaded: boolean = false;
  initialLoad: boolean = false;

  perPageOptions: Select2Data = [
    {
      value: 5,
      label: '5'
    },
    {
      value: 10,
      label: '10'
    },
    {
      value: 15,
      label: '15'
    },
    {
      value: 20,
      label: '20'
    }
  ];

  private getPatologiesSubject: Subject<void> = new Subject<void>();

  constructor(private patologiasService: PatologiasService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.patologias = [];
    this.actualPage = 1;
    this.getPatologiesSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe({
        next: () => {
          this.getPatologias()
        },
        error: (error: string[]) => {
          this.errores = error;
        }
      });
    this.initialLoad = true;
    this.getPatologiesSubject.next();
  }

  ngOnDestroy() {
    this.getPatologiesSubject.unsubscribe();
  }

  sanitizeHtml(inputHtml: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(inputHtml);
  }

  changePage(page: number) {
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = page;
      this.getPatologiesSubject.next();
    }
  }

  updateFilters(): void {
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = 1;
      this.getPatologiesSubject.next();
    }
  }

  getPatologias() {
    let request: Observable<PatologiasListModel>;
    request = this.patologiasService.getPatologias(
      this.search,
      parseInt(this.perPage),
      this.actualPage
    );

    request.subscribe({
      next: (response: PatologiasListModel) => {
        this.#showResults(response);
        this.dataLoaded = true;
      },
      error: (error: string[]) => {
        this.errores = error;
        console.log(error);
        this.dataLoaded = true;
      }
    });
  }

  #showResults(data) {
    console.log(data);
    this.patologias = data.resultados;
    this.itemsPerPage = data.items_pagina;
    this.nextPageUrl = data.next;
    this.actualPage = data.pagina_actual;
    this.totalPages = data.paginas_totales;
    this.previousPageUrl = data.prev;
    this.totalItems = data.cantidad_patologias;
    this.resultMin = data.result_min;
    this.resultMax = data.result_max;
  }
}
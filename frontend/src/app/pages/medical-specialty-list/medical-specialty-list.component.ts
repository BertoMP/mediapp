import {Component, OnInit} from '@angular/core';
import {
  MedicalSpecialtyModel
} from "../../core/interfaces/medical-specialty.model";
import {
  MedicalSpecialtiesService
} from "../../core/services/medical-specialties.service";
import {
  VerticalCardComponent
} from "../../shared/components/vertical-card/vertical-card.component";
import {LowerCasePipe, NgForOf, NgIf} from "@angular/common";
import {RemoveAccentsPipe} from "../../shared/pipes/remove-accents.pipe";
import {Subscription} from "rxjs";
import {
  LoadingSpinnerComponent
} from "../../shared/components/loading-spinner/loading-spinner.component";
import {NgxPaginationModule} from "ngx-pagination";
import {ChatBotComponent} from "../../shared/components/chat-bot/chat-bot.component";

@Component({
  selector: 'app-medical-specialty-list',
  standalone: true,
  imports: [
    VerticalCardComponent,
    LowerCasePipe,
    RemoveAccentsPipe,
    LoadingSpinnerComponent,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    ChatBotComponent
  ],
  templateUrl: './medical-specialty-list.component.html',
  styleUrl: './medical-specialty-list.component.scss'
})
export class MedicalSpecialtyListComponent implements OnInit {
  especialidadesSubscripcion: Subscription;
  specialties: MedicalSpecialtyModel[];
  error: boolean = false;

  nextPageUrl: string;
  previousPageUrl: string;
  actualPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;

  constructor(private medicalSpecialtiesService: MedicalSpecialtiesService) {
  }

  ngOnInit(): void {
    this.actualPage = 1;

    this.getSpecialties(this.actualPage);
  }

  getSpecialties(page: number): void {
    this.especialidadesSubscripcion =
      this.medicalSpecialtiesService.getSpecialties(page)
        .subscribe({
          next: (response) => {
            this.specialties = response.resultados;
            this.nextPageUrl = response.next;
            this.previousPageUrl = response.prev;
            this.totalPages = response.paginas_totales;
            this.totalItems = response.cantidad_especialidades;
            this.itemsPerPage = response.items_pagina;
          },
          error: () => {
            this.error = true;
          }
        });
  }
}

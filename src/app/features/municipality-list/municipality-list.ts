import { Component, inject, signal, computed, WritableSignal, Signal } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { GeoApiService } from '../../core/services/geo-api.service';
import { MunicipalityModel } from '../../core/domain/models/municipality.model';

@Component({
  selector: 'app-municipality-list',
  imports: [RouterLink, DecimalPipe, ScrollingModule],
  templateUrl: './municipality-list.html',
  styleUrl: './municipality-list.css',
})
export class MunicipalityList {
  #route: ActivatedRoute = inject(ActivatedRoute);
  #geoService: GeoApiService = inject(GeoApiService);

  filterQuery: WritableSignal<string> = signal('');

  departmentCode: Signal<string> = toSignal(
    this.#route.paramMap.pipe(
      map((params: ParamMap) => params.get('code') ?? '')
    ),
    { initialValue: '' }
  );

  #allMunicipalities: Signal<MunicipalityModel[]> = toSignal(
    this.#route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const code: string = params.get('code') ?? '';
        return this.#geoService.getMunicipalitiesByDepartment(code);
      })
    ),
    { initialValue: [] }
  );

  municipalities: Signal<MunicipalityModel[]> = computed(() => {
    const query: string = this.filterQuery().toLowerCase().trim();
    const all: MunicipalityModel[] | any[] = this.#allMunicipalities();

    if (!query) return all;

    return all.filter((municipality: MunicipalityModel) => municipality.name.toLowerCase().includes(query));
  });

  trackByCode(_index: number, municipality: MunicipalityModel): string {
    return municipality.code;
  }
}
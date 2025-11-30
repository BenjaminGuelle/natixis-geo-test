import { Component, inject, signal, computed, WritableSignal, Signal } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, tap, filter } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { GeoApiService } from '../../core/services/geo-api.service';
import { MunicipalityModel } from '../../core/domain/models/municipality.model';

type SortField = 'name' | 'population';
type SortOrder = 'asc' | 'desc' | 'none';
const SORT_ORDER_CYCLE: Record<SortOrder, SortOrder> = {
  none: 'asc',
  asc: 'desc',
  desc: 'none'
};

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
  loading: WritableSignal<boolean> = signal(false);
  sortField: WritableSignal<SortField> = signal<SortField>('name');
  sortOrder: WritableSignal<SortOrder> = signal<SortOrder>('none');

  departmentCode: Signal<string> = toSignal(
    this.#route.paramMap.pipe(
      map((params: ParamMap) => params.get('code') ?? '')
    ),
    { initialValue: '' }
  );

  department = toSignal(
    toObservable(this.departmentCode).pipe(
      filter(Boolean),
      switchMap(code => this.#geoService.getDepartmentByCode(code))
    )
  );

  totalPopulation: Signal<number> = computed(() => {
    const municipalities: MunicipalityModel[] = this.#allMunicipalities() ?? [];
    return municipalities.reduce((sum, m) => sum + (m.population ?? 0), 0);
  });

  #allMunicipalities = toSignal(
    toObservable(this.departmentCode).pipe(
      filter(Boolean),
      tap(() => this.loading.set(true)),
      switchMap((code: string) =>
        this.#geoService.getMunicipalitiesByDepartment(code).pipe(
          tap(() => this.loading.set(false))
        )
      )
    ),
    { initialValue: [] }
  );

  municipalities: Signal<MunicipalityModel[]> = computed(() => {
    const query: string = this.filterQuery().toLowerCase().trim();
    const field: SortField = this.sortField();
    const order: SortOrder = this.sortOrder();

    let municipalities: MunicipalityModel[] = this.#allMunicipalities() ?? [];

    if (query) {
      municipalities = municipalities.filter(municipality => municipality.name.toLowerCase().includes(query));
    }

    if (order !== 'none') {
      municipalities = this.#sortMunicipalities(municipalities, field, order);
    }

    return municipalities;
  });

  toggleSort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortOrder.set(SORT_ORDER_CYCLE[this.sortOrder()]);
    } else {
      this.sortField.set(field);
      this.sortOrder.set('asc');
    }
  }


  trackByCode(_index: number, municipality: MunicipalityModel): string {
    return municipality.code;
  }

  #sortMunicipalities(
    municipalities: MunicipalityModel[],
    field: SortField,
    order: SortOrder
  ): MunicipalityModel[] {
    return [...municipalities].sort((a, b) => {
      const comparison: number = field === 'name'
        ? a.name.localeCompare(b.name)
        : (a.population ?? 0) - (b.population ?? 0);
      return order === 'asc' ? comparison : -comparison;
    });
  }
}
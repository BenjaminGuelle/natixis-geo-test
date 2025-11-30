import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { GeoApiService } from '../../core/services/geo-api.service';
import { RegionModel } from '../../core/domain/models/region.model';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, of, switchMap, tap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputSearch } from './input-search/input-search';
import { DepartmentModel } from '../../core/domain/models/department.model';
import { Router } from '@angular/router';

@Component({
  selector: 'region-search',
  imports: [
    ReactiveFormsModule,
    InputSearch,
  ],
  templateUrl: './region-search.html',
  styleUrl: './region-search.css',
})
export class RegionSearch {
  #geoService: GeoApiService = inject(GeoApiService);
  #router: Router = inject(Router);

  searchControl: FormControl<string | null> = new FormControl('');
  loading: WritableSignal<boolean> = signal(false);
  selectedRegion: WritableSignal<RegionModel | null> = signal<RegionModel | null>(null);

  suggestions: Signal<RegionModel[]> = toSignal(
    this.searchControl.valueChanges.pipe(
      tap((value: string | null) => {
        const selected: RegionModel | null = this.selectedRegion();
        if (selected && value !== selected.name) {
          this.selectedRegion.set(null);
        }
      }),
      debounceTime(300),
      switchMap((search: string | null) =>
        search && search.trim().length > 0
          ? this.#geoService.searchRegions(search)
          : of([])
      )
    ),
    { initialValue: [] }
  );

  departments: Signal<DepartmentModel[]> = toSignal(
    toObservable(this.selectedRegion).pipe(
      tap(() => this.loading.set(true)),
      switchMap((region: RegionModel | null) =>
        region
          ? this.#geoService.getDepartmentsByRegion(region.code).pipe(
            tap(() => this.loading.set(false))
          )
          : of([])
      )
    ),
    { initialValue: [] }
  );

  displayRegion: (region: RegionModel) => string = (region: RegionModel): string => region.name;

  onSelectRegion(region: RegionModel): void {
    this.selectedRegion.set(region);
    this.searchControl.setValue(region.name, { emitEvent: false });
  }

  onSelectDepartment(department: DepartmentModel): void {
    this.#router.navigate(['/departments', department.code, 'municipalities']);
  }
}

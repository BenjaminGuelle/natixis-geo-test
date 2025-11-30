import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { GeoApiService } from '../../core/services/geo-api.service';
import { RegionModel } from '../../core/domain/models/region.model';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, filter, of, switchMap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputSearch } from './input-search/input-search';
import { DepartmentModel } from '../../core/domain/models/department.model';

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

  searchControl: FormControl<string | null> = new FormControl('');
  selectedRegion: WritableSignal<RegionModel | null> = signal<RegionModel | null>(null);

  suggestions: Signal<RegionModel[]> = toSignal(
    this.searchControl.valueChanges.pipe(
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
      filter((region: RegionModel | null): region is RegionModel => region !== null),
      switchMap((region: RegionModel) => this.#geoService.getDepartmentsByRegion(region.code))
    ),
    { initialValue: [] }
  );

  constructor() {
    this.searchControl.valueChanges.subscribe(value => {
      const selected: RegionModel | null = this.selectedRegion();
      if (selected && value !== selected.name) {
        this.selectedRegion.set(null);
      }
    });
  }

  displayRegion: (region: RegionModel) => string = (region: RegionModel): string => region.name;

  onSelectRegion(region: RegionModel): void {
    this.selectedRegion.set(region);
    this.searchControl.setValue(region.name, { emitEvent: false });
  }
}

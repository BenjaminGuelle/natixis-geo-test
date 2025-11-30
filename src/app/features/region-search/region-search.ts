import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { GeoApiService } from '../../core/services/geo-api.service';
import { RegionModel } from '../../core/domain/models/region.model';
import { DepartmentModel } from '../../core/domain/models/department.model';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, filter, switchMap } from 'rxjs';

@Component({
  selector: 'region-search',
  imports: [],
  templateUrl: './region-search.html',
  styleUrl: './region-search.css',
})
export class RegionSearch {
  #geoService: GeoApiService = inject(GeoApiService);

  query: WritableSignal<string> = signal('');
  selectedRegion: WritableSignal<RegionModel | null> = signal<RegionModel | null>(null);
  departments: WritableSignal<DepartmentModel[]> = signal<DepartmentModel[]>([]);
  showSuggestions: WritableSignal<boolean> = signal(false);

  suggestions: Signal<RegionModel[] | any[]> = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      filter((search: string) => search.trim().length > 0),
      switchMap((search: string) => this.#geoService.searchRegions(search))
    ),
    { initialValue: [] }
  );
}
